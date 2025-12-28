using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Core.Interface;
using Hoops.Infrastructure.Data;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Hoops.Data.Seeders
{
    public class ScheduleDivTeamsSeeder : ISeeder<ScheduleDivTeam>
    {
        public hoopsContext context { get; private set; }
        private readonly IScheduleDivTeamsRepository _scheduleDivTeamsRepo;
        private readonly ISeasonRepository _seasonRepo;
        private readonly IDivisionRepository _divisionRepo;
        private readonly ILogger<ScheduleDivTeamsSeeder> _logger;

        public ScheduleDivTeamsSeeder(
            IScheduleDivTeamsRepository scheduleDivTeamsRepo,
            ISeasonRepository seasonRepo,
            IDivisionRepository divisionRepo,
            hoopsContext context,
            ILogger<ScheduleDivTeamsSeeder> logger)
        {
            this.context = context;
            _scheduleDivTeamsRepo = scheduleDivTeamsRepo;
            _seasonRepo = seasonRepo;
            _divisionRepo = divisionRepo;
            _logger = logger;
        }

        public async Task DeleteAllAsync()
        {
            try
            {
                _logger.LogDebug("Attempting to delete all schedule div teams using raw SQL");
                var deletedCount = await context.Database.ExecuteSqlRawAsync("DELETE FROM ScheduleDivTeams");
                _logger.LogDebug("Successfully deleted schedule div teams using raw SQL");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting schedule div teams: {Message}", ex.Message);
                throw;
            }
        }

        public async Task SeedAsync()
        {
            try
            {
                _logger.LogDebug("Starting ScheduleDivTeams seeding");

                var seasons = await _seasonRepo.GetAllAsync();

                foreach (var season in seasons)
                {
                    _logger.LogDebug("Seeding ScheduleDivTeams for Season: {SeasonDescription}", season.Description);

                    var divisions = await context.Divisions
                        .Where(d => d.SeasonId == season.SeasonId)
                        .OrderBy(d => d.DivisionId)
                        .ToListAsync();

                    // Simulate external scheduling program: Create ScheduleNumber starting from 1
                    // This represents how the external program groups divisions for scheduling
                    var externalScheduleNumber = 1;

                    foreach (var division in divisions)
                    {
                        // Get actual teams for this division (assumes teams are seeded first)
                        var divisionTeams = await context.Teams
                            .Where(t => t.DivisionId == division.DivisionId && t.SeasonId == season.SeasonId)
                            .OrderBy(t => t.TeamId)
                            .ToListAsync();

                        var numberOfTeams = divisionTeams.Count;
                        _logger.LogDebug("Creating {TeamCount} ScheduleDivTeam mappings for External Schedule #{ScheduleNumber} (Division: {DivisionDescription})", numberOfTeams, externalScheduleNumber, division.DivisionDescription);

                        if (numberOfTeams == 0)
                        {
                            _logger.LogWarning("No teams found for Division {DivisionId} in Season {SeasonId}. Skipping.", division.DivisionId, season.SeasonId);
                            externalScheduleNumber++;
                            continue;
                        }

                        // Simulate external program logic:
                        // - ScheduleNumber: External program's schedule grouping (1, 2, 3, ...)
                        // - DivisionNumber: External program's division identifier (could be same as ScheduleNumber)
                        var externalDivisionNumber = externalScheduleNumber; // External program's division ID
                        var scheduleNumber = externalScheduleNumber; // External program's schedule ID

                        int teamIndex = 1;
                        foreach (var team in divisionTeams)
                        {
                            var scheduleDivTeam = new ScheduleDivTeam
                            {
                                DivisionNumber = externalDivisionNumber, // External program's division number
                                TeamNumber = team.TeamId, // IMPORTANT: Use actual Team.TeamId, not sequential number
                                ScheduleNumber = scheduleNumber, // External program's schedule group identifier
                                ScheduleTeamNumber = teamIndex, // Team number within this division (1, 2, 3, etc.)
                                HomeLocation = 1, // Default location
                                SeasonId = season.SeasonId // Would be set manually in real process, but set here for seeding
                                // ScheduleDivTeamsId will be auto-generated
                            };

                            await _scheduleDivTeamsRepo.InsertAsync(scheduleDivTeam);

                            // Debug logging for team mapping
                            _logger.LogDebug("Created ScheduleDivTeam: SeasonId={SeasonId}, ScheduleNumber={ScheduleNumber}, ScheduleTeamNumber={ScheduleTeamNumber}, TeamNumber={TeamNumber} (TeamId={TeamId})", season.SeasonId, scheduleNumber, teamIndex, team.TeamId, team.TeamId);

                            teamIndex++;
                        }

                        externalScheduleNumber++; // Increment for next external schedule group
                    }

                    await context.SaveChangesAsync();
                    _logger.LogDebug("Completed ScheduleDivTeams seeding for Season: {SeasonDescription}", season.Description);
                }

                _logger.LogDebug("ScheduleDivTeams seeding completed successfully");

                // Log summary of team mappings created
                var teamMappingsCount = await _scheduleDivTeamsRepo.GetAllAsync();
                _logger.LogInformation("Created {Count} ScheduleDivTeam mappings", teamMappingsCount.Count());

                foreach (var mapping in teamMappingsCount.OrderBy(x => x.SeasonId).ThenBy(x => x.ScheduleNumber).ThenBy(x => x.ScheduleTeamNumber))
                {
                    _logger.LogDebug("SeasonId={SeasonId}, Schedule={ScheduleNumber}, ScheduleTeam={ScheduleTeamNumber}, TeamNumber={TeamNumber}", mapping.SeasonId, mapping.ScheduleNumber, mapping.ScheduleTeamNumber, mapping.TeamNumber);
                }

                // Validate the mappings we just created
                await ValidateTeamMappings(teamMappingsCount);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding ScheduleDivTeams: {Message}", ex.Message);
                throw;
            }
        }

        private Task ValidateTeamMappings(IEnumerable<ScheduleDivTeam> teamMappings)
        {
            _logger.LogInformation("Starting ScheduleDivTeam validation...");

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
                _logger.LogError("Found {ErrorCount} validation errors", validationErrors.Count);
                foreach (var error in validationErrors)
                {
                    _logger.LogError("  - {Error}", error);
                }
                throw new InvalidOperationException($"ScheduleDivTeam validation failed with {validationErrors.Count} errors");
            }
            else
            {
                _logger.LogInformation("All ScheduleDivTeam mappings are valid");
            }

            return Task.CompletedTask;
        }
    }
}
