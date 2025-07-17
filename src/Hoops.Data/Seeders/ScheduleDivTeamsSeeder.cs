using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Core.Interface;
using Hoops.Infrastructure.Data;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Hoops.Data.Seeders
{
    public class ScheduleDivTeamsSeeder : ISeeder<ScheduleDivTeam>
    {
        public hoopsContext context { get; private set; }
        private readonly IScheduleDivTeamsRepository _scheduleDivTeamsRepo;
        private readonly ISeasonRepository _seasonRepo;
        private readonly IDivisionRepository _divisionRepo;

        public ScheduleDivTeamsSeeder(
            IScheduleDivTeamsRepository scheduleDivTeamsRepo,
            ISeasonRepository seasonRepo,
            IDivisionRepository divisionRepo,
            hoopsContext context)
        {
            this.context = context;
            _scheduleDivTeamsRepo = scheduleDivTeamsRepo;
            _seasonRepo = seasonRepo;
            _divisionRepo = divisionRepo;
        }

        public async Task DeleteAllAsync()
        {
            try
            {
                Console.WriteLine("[DEBUG] Attempting to delete all schedule div teams using raw SQL");
                var deletedCount = await context.Database.ExecuteSqlRawAsync("DELETE FROM ScheduleDivTeams");
                Console.WriteLine($"[DEBUG] Successfully deleted schedule div teams using raw SQL");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Error deleting schedule div teams: {ex.Message}");
                Console.WriteLine($"[ERROR] Stack trace: {ex.StackTrace}");
                throw;
            }
        }

        public async Task SeedAsync()
        {
            try
            {
                Console.WriteLine("[DEBUG] Starting ScheduleDivTeams seeding");

                var seasons = await _seasonRepo.GetAllAsync();

                foreach (var season in seasons)
                {
                    Console.WriteLine($"[DEBUG] Seeding ScheduleDivTeams for Season: {season.Description}");
                    
                    var divisions = await context.Divisions
                        .Where(d => d.SeasonId == season.SeasonId)
                        .ToListAsync();

                    var seasonTeamNumber = 1; // Team number unique per season
                    var random = new Random();

                    foreach (var division in divisions)
                    {
                        // Randomize number of teams per division (4-14 teams)
                        var numberOfTeams = random.Next(4, 15);
                        Console.WriteLine($"[DEBUG] Creating {numberOfTeams} teams for Division: {division.DivisionDescription}");

                        // For seeding purposes, use incrementing numbers for DivisionNumber and ScheduleNumber
                        // In real import, these come from 3rd party software
                        var divisionNumber = division.DivisionId;
                        var scheduleNumber = division.DivisionId; // Same as division number for seeding

                        for (int teamIndex = 1; teamIndex <= numberOfTeams; teamIndex++)
                        {
                            var scheduleDivTeam = new ScheduleDivTeam
                            {
                                DivisionNumber = divisionNumber,
                                TeamNumber = seasonTeamNumber, // Unique per season
                                ScheduleNumber = scheduleNumber,
                                ScheduleTeamNumber = teamIndex, // Unique per division (1, 2, 3, etc.)
                                HomeLocation = 1, // Default location - not used according to requirements
                                SeasonId = season.SeasonId
                                // ScheduleDivTeamsId will be auto-generated
                            };

                            await _scheduleDivTeamsRepo.InsertAsync(scheduleDivTeam);
                            seasonTeamNumber++; // Increment for next team in season
                        }
                    }

                    await context.SaveChangesAsync();
                    Console.WriteLine($"[DEBUG] Completed ScheduleDivTeams seeding for Season: {season.Description}");
                }

                Console.WriteLine("[DEBUG] ScheduleDivTeams seeding completed successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Error seeding ScheduleDivTeams: {ex.Message}");
                Console.WriteLine($"[ERROR] Stack trace: {ex.StackTrace}");
                throw;
            }
        }
    }
}
