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
                        // var numberOfTeams = random.Next(4, 15);
                        // changed to get what was created - assumes teams is done first.
                        var numberOfTeams = context.Teams.Count(t => t.DivisionId == division.DivisionId);
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

                            // Debug logging for team mapping
                            Console.WriteLine($"[DEBUG] Created ScheduleDivTeam: SeasonId={season.SeasonId}, ScheduleNumber={scheduleNumber}, ScheduleTeamNumber={teamIndex}, TeamNumber={seasonTeamNumber}");

                            seasonTeamNumber++; // Increment for next team in season
                        }

                        externalScheduleNumber++; // Increment for next external schedule group
                    }

                    await context.SaveChangesAsync();
                    Console.WriteLine($"[DEBUG] Completed ScheduleDivTeams seeding for Season: {season.Description}");
                }

                Console.WriteLine("[DEBUG] ScheduleDivTeams seeding completed successfully");

                // Log summary of team mappings created
                var teamMappingsCount = await _scheduleDivTeamsRepo.GetAllAsync();
                Console.WriteLine($"[SUMMARY] Created {teamMappingsCount.Count()} ScheduleDivTeam mappings");

                foreach (var mapping in teamMappingsCount.OrderBy(x => x.SeasonId).ThenBy(x => x.ScheduleNumber).ThenBy(x => x.ScheduleTeamNumber))
                {
                    Console.WriteLine($"  SeasonId={mapping.SeasonId}, Schedule={mapping.ScheduleNumber}, ScheduleTeam={mapping.ScheduleTeamNumber}, TeamNumber={mapping.TeamNumber}");
                }

                // Validate the mappings we just created
                await ValidateTeamMappings(teamMappingsCount);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Error seeding ScheduleDivTeams: {ex.Message}");
                Console.WriteLine($"[ERROR] Stack trace: {ex.StackTrace}");
                throw;
            }
        }

        private Task ValidateTeamMappings(IEnumerable<ScheduleDivTeam> teamMappings)
        {
            Console.WriteLine("[VALIDATION] Starting ScheduleDivTeam validation...");

            var mappingsList = teamMappings.ToList();
            var validationErrors = new List<string>();

            // Check for duplicate team numbers within same season
            var duplicateTeamNumbers = mappingsList
                .GroupBy(x => new { x.SeasonId, x.TeamNumber })
                .Where(g => g.Count() > 1)
                .Select(g => g.Key);

            foreach (var dup in duplicateTeamNumbers)
            {
                validationErrors.Add($"Duplicate TeamNumber {dup.TeamNumber} found in Season {dup.SeasonId}");
            }

            // Check for duplicate schedule team numbers within same schedule
            var duplicateScheduleTeams = mappingsList
                .GroupBy(x => new { x.SeasonId, x.ScheduleNumber, x.ScheduleTeamNumber })
                .Where(g => g.Count() > 1)
                .Select(g => g.Key);

            foreach (var dup in duplicateScheduleTeams)
            {
                validationErrors.Add($"Duplicate ScheduleTeamNumber {dup.ScheduleTeamNumber} found in Season {dup.SeasonId}, Schedule {dup.ScheduleNumber}");
            }

            // Check for gaps in team numbering
            var seasonGroups = mappingsList.GroupBy(x => x.SeasonId);
            foreach (var seasonGroup in seasonGroups)
            {
                var teamNumbers = seasonGroup.Select(x => x.TeamNumber).OrderBy(x => x).ToList();
                for (int i = 1; i < teamNumbers.Count; i++)
                {
                    if (teamNumbers[i] != teamNumbers[i - 1] + 1)
                    {
                        validationErrors.Add($"Gap in TeamNumber sequence in Season {seasonGroup.Key}: {teamNumbers[i - 1]} -> {teamNumbers[i]}");
                    }
                }
            }

            if (validationErrors.Any())
            {
                Console.WriteLine($"[VALIDATION ERROR] Found {validationErrors.Count} validation errors:");
                foreach (var error in validationErrors)
                {
                    Console.WriteLine($"  - {error}");
                }
                throw new InvalidOperationException($"ScheduleDivTeam validation failed with {validationErrors.Count} errors");
            }
            else
            {
                Console.WriteLine("[VALIDATION SUCCESS] All ScheduleDivTeam mappings are valid");
            }

            return Task.CompletedTask;
        }
    }
}
