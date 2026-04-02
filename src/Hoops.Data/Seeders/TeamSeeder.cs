using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Core.Interface;
using Hoops.Infrastructure.Repository;
using Hoops.Infrastructure.Data;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Hoops.Data.Seeders
{
    public class TeamSeeder : ISeeder<Team>
    {
        public hoopsContext context { get; private set; }
        private readonly ITeamRepository _teamRepo;
        private readonly ILogger<TeamSeeder> _logger;

        public TeamSeeder(ITeamRepository teamRepo, hoopsContext context, ILogger<TeamSeeder> logger)
        {
            this.context = context;
            _teamRepo = teamRepo;
            _logger = logger;
        }

        public async Task DeleteAllAsync()
        {
            try
            {
                // Use raw SQL to avoid Entity Framework null value issues
                _logger.LogDebug("Attempting to delete all teams using raw SQL");

                var deletedCount = await context.Database.ExecuteSqlRawAsync("DELETE FROM Teams");
                _logger.LogDebug("Successfully deleted {DeletedCount} teams using raw SQL", deletedCount);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting teams: {Message}", ex.Message);
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
                    _logger.LogWarning("No colors found. Teams will be created without color assignments.");
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
                        _logger.LogDebug("Creating {TeamCount} teams for Division {Division} in Season {Season}", teamCount, division.DivisionDescription, season.Description);
                        
                        for (var i = 1; i <= teamCount; i++)
                        {
                            var team = new Team
                            {
                                SeasonId = season.SeasonId,
                                DivisionId = division.DivisionId,
                                TeamNumber = i.ToString(),
                                TeamName = null,
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
                _logger.LogDebug("Successfully seeded all teams");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding teams: {Message}", ex.Message);
                throw;
            }
        }
    }

}
