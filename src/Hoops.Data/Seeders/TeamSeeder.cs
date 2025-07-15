using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Core.Interface;
using Hoops.Infrastructure.Repository;
using Hoops.Infrastructure.Data;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Hoops.Data.Seeders
{
    public class TeamSeeder : ISeeder<Team>
    {
        public hoopsContext context { get; private set; }
        private readonly ITeamRepository _teamRepo;

        public TeamSeeder(ITeamRepository teamRepo, hoopsContext context)
        {
            this.context = context;
            _teamRepo = teamRepo;
        }

        public async Task DeleteAllAsync()
        {
            var records = await _teamRepo.GetAllAsync();
            Console.WriteLine($"[DEBUG] Found {records.Count()} teams to delete");
            foreach (var record in records)
            {
                Console.WriteLine($"[DEBUG] Attempting to delete Person ID: {record.TeamId}, Name: {record.TeamName}");
                await _teamRepo.DeleteAsync(record.TeamId);
            }
        }
        public async Task SeedAsync()
        {
            int maxTeamId = context.Teams.Any() ? context.Teams.Max(c => c.TeamId) : 0;
            var currentSeason = await context.Seasons
                        .FirstOrDefaultAsync(s => s.CurrentSeason == true);
            // var divisions = await context.Divisions
            // .Where(d => d.SeasonId == currentSeason.SeasonId).ToListAsync();
            // Console.WriteLine($"[DEBUG] Found {divisions.Count()} seasons to initialize teams for.");

            var seasons = await context.Seasons.ToListAsync();
            var colors = await context.Colors.ToListAsync();
            var ranColor = new Random();
            var ranTeams = new Random();
            foreach (var season in seasons)
            {
                var divisions = await context.Divisions
                .Where(d => d.SeasonId == season.SeasonId).ToListAsync();
                var counter = 0;

                foreach (var division in divisions)
                {
                    var teams = new List<Team>();

                    for (var i = 1; i <= ranTeams.Next(4, 15); i++)
                    {
                        counter++;
                        {
                            teams.Add(
                            new Team
                            {
                                SeasonId = season.SeasonId,
                                DivisionId = division.DivisionId,
                                TeamNumber = i.ToString(),
                                TeamColorId = colors.ElementAt(ranColor.Next(1, colors.Count())).ColorId,
                                CreatedDate = DateTime.Now,
                                CreatedUser = "Seed",

                            }
                            );
                        }
                    }

                    foreach (var team in teams)
                    {
                        await _teamRepo.InsertAsync(team);
                    }
                    context.SaveChanges();
                }
            }


        }
    }

}
