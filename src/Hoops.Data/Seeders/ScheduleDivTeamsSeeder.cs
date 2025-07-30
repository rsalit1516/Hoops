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
                        .OrderBy(d => d.DivisionId)
                        .ToListAsync();

                    var seasonTeamNumber = 1; // Team number unique per season (external program perspective)
                    var random = new Random();

                    // Simulate external scheduling program: Create ScheduleNumber starting from 1
                    // This represents how the external program groups divisions for scheduling
                    var externalScheduleNumber = 1;

                    foreach (var division in divisions)
                    {
                        // Randomize number of teams per division (4-14 teams)
                        var numberOfTeams = random.Next(4, 15);
                        Console.WriteLine($"[DEBUG] Creating {numberOfTeams} teams for External Schedule #{externalScheduleNumber} (Division: {division.DivisionDescription})");

                        // Simulate external program logic:
                        // - ScheduleNumber: External program's schedule grouping (1, 2, 3, ...)
                        // - DivisionNumber: External program's division identifier (could be same as ScheduleNumber)
                        var externalDivisionNumber = externalScheduleNumber; // External program's division ID
                        var scheduleNumber = externalScheduleNumber; // External program's schedule ID

                        for (int teamIndex = 1; teamIndex <= numberOfTeams; teamIndex++)
                        {
                            var scheduleDivTeam = new ScheduleDivTeam
                            {
                                DivisionNumber = externalDivisionNumber, // External program's division number
                                TeamNumber = seasonTeamNumber, // Unique team number across entire season
                                ScheduleNumber = scheduleNumber, // External program's schedule group identifier
                                ScheduleTeamNumber = teamIndex, // Team number within this division (1, 2, 3, etc.)
                                HomeLocation = 1, // Default location
                                SeasonId = season.SeasonId // Would be set manually in real process, but set here for seeding
                                // ScheduleDivTeamsId will be auto-generated
                            };

                            await _scheduleDivTeamsRepo.InsertAsync(scheduleDivTeam);
                            seasonTeamNumber++; // Increment for next team in season
                        }
                        
                        externalScheduleNumber++; // Increment for next external schedule group
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
