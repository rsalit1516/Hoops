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
            try
            {
                // Use raw SQL to avoid Entity Framework null value issues
                Console.WriteLine("[DEBUG] Attempting to delete all teams using raw SQL");
                
                var deletedCount = await context.Database.ExecuteSqlRawAsync("DELETE FROM Teams");
                Console.WriteLine($"[DEBUG] Successfully deleted {deletedCount} teams using raw SQL");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Error deleting teams: {ex.Message}");
                Console.WriteLine($"[ERROR] Stack trace: {ex.StackTrace}");
                throw;
            }
        }
        public async Task SeedAsync()
        {
            try
            {
                int maxTeamId = context.Teams.Any() ? context.Teams.Max(c => c.TeamId) : 0;
                var seasons = await context.Seasons.ToListAsync();
                var colors = await context.Colors.ToListAsync();
                
                if (!colors.Any())
                {
                    Console.WriteLine("[WARNING] No colors found. Teams will be created without color assignments.");
                }
                
                var ranColor = new Random();
                var ranTeams = new Random();
                
                foreach (var season in seasons)
                {
                    var divisions = await context.Divisions
                        .Where(d => d.SeasonId == season.SeasonId).ToListAsync();
                    
                    foreach (var division in divisions)
                    {
                        var teamCount = ranTeams.Next(4, 15);
                        Console.WriteLine($"[DEBUG] Creating {teamCount} teams for Division {division.DivisionDescription} in Season {season.Description}");
                        
                        for (var i = 1; i <= teamCount; i++)
                        {
                            var team = new Team
                            {
                                SeasonId = season.SeasonId,
                                DivisionId = division.DivisionId,
                                TeamNumber = i.ToString(),
                                TeamName = $"Team {i} - {division.DivisionDescription}",
                                TeamColor = colors.Any() ? colors.ElementAt(ranColor.Next(0, colors.Count)).ColorName : "Unknown",
                                TeamColorId = colors.Any() ? colors.ElementAt(ranColor.Next(0, colors.Count)).ColorId : 1,
                                CreatedDate = DateTime.Now,
                                CreatedUser = "Seed"
                            };
                            
                            context.Teams.Add(team);
                        }
                    }
                }
                
                await context.SaveChangesAsync();
                Console.WriteLine($"[DEBUG] Successfully seeded all teams");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Error seeding teams: {ex.Message}");
                throw;
            }
        }
    }

}
