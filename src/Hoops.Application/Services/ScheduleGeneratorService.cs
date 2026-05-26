using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Core.Scheduling;
using Hoops.Core.ViewModels;
using Microsoft.Extensions.Logging;

namespace Hoops.Application.Services
{
    public class ScheduleGeneratorService : IScheduleGeneratorService
    {
        private readonly ITeamRepository _teamRepo;
        private readonly IDivisionRepository _divisionRepo;
        private readonly ILocationRepository _locationRepo;
        private readonly IScheduleGameRepository _gameRepo;
        private readonly ILogger<ScheduleGeneratorService> _logger;

        public ScheduleGeneratorService(
            ITeamRepository teamRepo,
            IDivisionRepository divisionRepo,
            ILocationRepository locationRepo,
            IScheduleGameRepository gameRepo,
            ILogger<ScheduleGeneratorService> logger)
        {
            _teamRepo = teamRepo;
            _divisionRepo = divisionRepo;
            _locationRepo = locationRepo;
            _gameRepo = gameRepo;
            _logger = logger;
        }

        public async Task<ScheduleGeneratorResult> PreviewAsync(ScheduleGeneratorRequest request)
        {
            if (request.DivisionIds == null || request.DivisionIds.Count == 0)
                return Fail("At least one division must be selected.");

            if (request.StartDate >= request.EndDate)
                return Fail("Start date must be before end date.");

            if (request.GamesPerTeam <= 0)
                return Fail("Games per team must be greater than zero.");

            if (request.TimeSlots == null || request.TimeSlots.Count == 0)
                return Fail("At least one time slot must be configured.");

            var locations = (await _locationRepo.GetAll()).ToList();
            if (locations.Count == 0)
                return Fail("No locations found. Add at least one location before generating a schedule.");

            var slotManager = new GameTimeSlotManager(request.TimeSlots);
            var allPreviewGames = new List<ScheduleGamePreviewItem>();
            // tracks (date, time) -> set of coachIds already scheduled (for cross-division conflict detection)
            var coachSlotMap = new Dictionary<(DateTime date, TimeSpan time), HashSet<int>>();

            for (int divIndex = 0; divIndex < request.DivisionIds.Count; divIndex++)
            {
                var divisionId = request.DivisionIds[divIndex];
                var division = await _divisionRepo.GetByIdAsync(divisionId);
                if (division == null)
                {
                    _logger.LogWarning("Division {DivisionId} not found, skipping.", divisionId);
                    continue;
                }

                var teams = _teamRepo.GetDivisionTeamsWithCoaches(divisionId);

                if (teams.Count < 2)
                {
                    _logger.LogWarning("Division {DivisionId} has fewer than 2 teams, skipping.", divisionId);
                    continue;
                }

                var scheduleNumber = divisionId; // use divisionId as schedule group identifier
                var pairings = GenerateRoundRobinPairings(teams, request.GamesPerTeam);

                var gamesPerTeamCount = teams.ToDictionary(t => t.TeamId, _ => 0);
                // track games scheduled this week per team: teamId -> (weekStart -> count)
                var weeklyGameCount = new Dictionary<int, Dictionary<DateTime, int>>();

                int gameNumber = 1;
                foreach (var (home, visiting) in pairings)
                {
                    var slot = FindNextSlot(
                        request, locations, slotManager, coachSlotMap,
                        home, visiting, weeklyGameCount, allPreviewGames, divisionId, divIndex);

                    if (slot == null)
                    {
                        _logger.LogWarning("Could not find a slot for {Home} vs {Visiting} in division {Division}",
                            home.TeamId, visiting.TeamId, division.DivisionDescription);
                        continue;
                    }

                    var (gameDate, gameTime, location) = slot.Value;
                    var legacyGameTime = new DateTime(1899, 12, 30).Add(gameTime).ToString("yyyy-MM-dd HH:mm:ss");

                    var warnings = new List<string>();

                    if (request.EnforceCoachConflicts)
                    {
                        var slotKey = (gameDate.Date, gameTime);
                        if (!coachSlotMap.TryGetValue(slotKey, out var usedCoaches))
                        {
                            usedCoaches = new HashSet<int>();
                            coachSlotMap[slotKey] = usedCoaches;
                        }

                        CheckAndRecordCoachConflict(home, slotKey, coachSlotMap, warnings, "Home");
                        CheckAndRecordCoachConflict(visiting, slotKey, coachSlotMap, warnings, "Visiting");

                        RecordCoachIds(home, coachSlotMap[slotKey]);
                        RecordCoachIds(visiting, coachSlotMap[slotKey]);
                    }

                    var fullDateTime = gameDate.Date.Add(gameTime);
                    allPreviewGames.Add(new ScheduleGamePreviewItem
                    {
                        DivisionId = divisionId,
                        DivisionName = division.DivisionDescription ?? $"Division {divisionId}",
                        ScheduleNumber = scheduleNumber,
                        GameNumber = gameNumber++,
                        GameDate = fullDateTime,
                        GameTime = legacyGameTime,
                        LocationNumber = location.LocationNumber,
                        LocationName = location.LocationName ?? $"Location {location.LocationNumber}",
                        HomeTeamId = home.TeamId,
                        HomeTeamName = home.GetDisplayName(),
                        VisitingTeamId = visiting.TeamId,
                        VisitingTeamName = visiting.GetDisplayName(),
                        Warnings = warnings,
                    });

                    IncrementWeeklyCount(weeklyGameCount, home.TeamId, gameDate);
                    IncrementWeeklyCount(weeklyGameCount, visiting.TeamId, gameDate);
                }

                _logger.LogInformation("Generated {Count} games for division {Name}", gameNumber - 1, division.DivisionDescription);
            }

            return new ScheduleGeneratorResult
            {
                Success = true,
                Games = allPreviewGames,
            };
        }

        public async Task<ScheduleCommitResult> CommitAsync(ScheduleCommitRequest request)
        {
            var result = new ScheduleCommitResult();

            foreach (var item in request.Games)
            {
                try
                {
                    var game = new ScheduleGame
                    {
                        ScheduleNumber = item.ScheduleNumber,
                        GameNumber = item.GameNumber,
                        LocationNumber = item.LocationNumber,
                        GameDate = item.GameDate,
                        GameTime = item.GameTime,
                        HomeTeamNumber = item.HomeTeamId,
                        VisitingTeamNumber = item.VisitingTeamId,
                        SeasonId = request.SeasonId,
                        DivisionId = item.DivisionId,
                        HomeForfeited = false,
                        VisitingForfeited = false,
                    };
                    await _gameRepo.InsertAsync(game);
                    result.GamesCreated++;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to save game {GameNumber} for division {DivisionId}", item.GameNumber, item.DivisionId);
                    result.Errors.Add($"Division {item.DivisionId} game {item.GameNumber}: {ex.Message}");
                }
            }

            if (result.GamesCreated > 0)
                await _gameRepo.SaveChangesAsync();

            return result;
        }

        // ----- private helpers -----

        private static ScheduleGeneratorResult Fail(string message) =>
            new() { Success = false, ErrorMessage = message };

        private static List<(Team home, Team visiting)> GenerateRoundRobinPairings(List<Team> teams, int gamesPerTeam)
        {
            var pairings = new List<(Team home, Team visiting)>();
            var gameCount = teams.ToDictionary(t => t.TeamId, _ => 0);
            var roundIndex = 0;

            while (gameCount.Values.Any(g => g < gamesPerTeam) && roundIndex < 100)
            {
                var round = GenerateRound(teams, roundIndex);
                foreach (var (home, visiting) in round)
                {
                    if (gameCount[home.TeamId] < gamesPerTeam && gameCount[visiting.TeamId] < gamesPerTeam)
                    {
                        pairings.Add((home, visiting));
                        gameCount[home.TeamId]++;
                        gameCount[visiting.TeamId]++;
                    }
                }
                roundIndex++;
            }

            return pairings;
        }

        private static IEnumerable<(Team home, Team visiting)> GenerateRound(List<Team> teams, int round)
        {
            var working = new List<Team>(teams);
            if (working.Count % 2 == 1) working.Add(null!); // bye slot
            var n = working.Count;

            for (int i = 0; i < n / 2; i++)
            {
                var hi = i;
                var vi = n - 1 - i;

                if (round > 0)
                {
                    if (hi > 0) hi = ((hi - 1 + round) % (n - 1)) + 1;
                    if (vi > 0) vi = ((vi - 1 + round) % (n - 1)) + 1;
                }

                var home = working[hi];
                var visiting = working[vi];
                if (home != null && visiting != null)
                    yield return (home, visiting);
            }
        }

        private (DateTime date, TimeSpan time, Location location)? FindNextSlot(
            ScheduleGeneratorRequest request,
            List<Location> allLocations,
            GameTimeSlotManager slotManager,
            Dictionary<(DateTime date, TimeSpan time), HashSet<int>> coachSlotMap,
            Team home,
            Team visiting,
            Dictionary<int, Dictionary<DateTime, int>> weeklyGameCount,
            List<ScheduleGamePreviewItem> alreadyScheduled,
            int divisionId,
            int divIndex)
        {
            var current = request.StartDate.Date;
            var end = request.EndDate.Date;

            while (current <= end)
            {
                if (!IsBlackedOut(current, null, request.BlackoutDates))
                {
                    if (WeeklyCountFor(weeklyGameCount, home.TeamId, current) < request.MaxGamesPerWeekPerTeam &&
                        WeeklyCountFor(weeklyGameCount, visiting.TeamId, current) < request.MaxGamesPerWeekPerTeam)
                    {
                        var validLocationIds = slotManager.GetLocationsForDivisionAndDay(divisionId, current.DayOfWeek);
                        var locations = allLocations.Where(l => validLocationIds.Contains(l.LocationNumber));

                        foreach (var location in locations)
                        {
                            if (IsBlackedOut(current, location.LocationNumber, request.BlackoutDates)) continue;

                            var time = slotManager.ClaimNextSlot(divisionId, current, location.LocationNumber);
                            if (time == null) continue;

                            return (current, time.Value, location);
                        }
                    }
                }

                current = current.AddDays(1);
            }

            return null;
        }

        private static bool IsBlackedOut(DateTime date, int? locationId, List<ScheduleBlackoutDate> blackouts)
        {
            if (blackouts == null) return false;
            return blackouts.Any(b =>
                date.Date >= b.StartDate.Date && date.Date <= b.EndDate.Date &&
                (b.LocationId == null || b.LocationId == locationId));
        }

        private static DateTime GetWeekStart(DateTime date)
        {
            var diff = (int)date.DayOfWeek - (int)DayOfWeek.Monday;
            if (diff < 0) diff += 7;
            return date.AddDays(-diff).Date;
        }

        private static int WeeklyCountFor(Dictionary<int, Dictionary<DateTime, int>> map, int teamId, DateTime date)
        {
            var week = GetWeekStart(date);
            if (!map.TryGetValue(teamId, out var weeks)) return 0;
            return weeks.TryGetValue(week, out var count) ? count : 0;
        }

        private static void IncrementWeeklyCount(Dictionary<int, Dictionary<DateTime, int>> map, int teamId, DateTime date)
        {
            var week = GetWeekStart(date);
            if (!map.ContainsKey(teamId)) map[teamId] = new Dictionary<DateTime, int>();
            map[teamId].TryGetValue(week, out var current);
            map[teamId][week] = current + 1;
        }

        private static void CheckAndRecordCoachConflict(
            Team team,
            (DateTime date, TimeSpan time) slotKey,
            Dictionary<(DateTime date, TimeSpan time), HashSet<int>> coachSlotMap,
            List<string> warnings,
            string role)
        {
            if (!coachSlotMap.TryGetValue(slotKey, out var used)) return;

            if (team.CoachId.HasValue && used.Contains(team.CoachId.Value))
                warnings.Add($"{role} team coach (ID {team.CoachId}) already scheduled at this time.");

            if (team.AssCoachId.HasValue && used.Contains(team.AssCoachId.Value))
                warnings.Add($"{role} assistant coach (ID {team.AssCoachId}) already scheduled at this time.");
        }

        private static void RecordCoachIds(Team team, HashSet<int> usedCoaches)
        {
            if (team.CoachId.HasValue) usedCoaches.Add(team.CoachId.Value);
            if (team.AssCoachId.HasValue) usedCoaches.Add(team.AssCoachId.Value);
        }
    }
}
