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
    public class ScheduleGameSeeder : ISeeder<ScheduleGame>
    {
        public hoopsContext context { get; private set; }
        private readonly IScheduleGameRepository _scheduleGameRepo;
        private readonly ISeasonRepository _seasonRepo;
        private readonly IDivisionRepository _divisionRepo;
        private readonly IScheduleDivTeamsRepository _scheduleDivTeamsRepo;
        private readonly ILocationRepository _locationRepo;

        public ScheduleGameSeeder(
            IScheduleGameRepository scheduleGameRepo,
            ISeasonRepository seasonRepo,
            IDivisionRepository divisionRepo,
            IScheduleDivTeamsRepository scheduleDivTeamsRepo,
            ILocationRepository locationRepo,
            hoopsContext context)
        {
            this.context = context;
            _scheduleGameRepo = scheduleGameRepo;
            _seasonRepo = seasonRepo;
            _divisionRepo = divisionRepo;
            _scheduleDivTeamsRepo = scheduleDivTeamsRepo;
            _locationRepo = locationRepo;
        }

        public async Task DeleteAllAsync()
        {
            try
            {
                Console.WriteLine("[DEBUG] Attempting to delete all schedule games using raw SQL");
                var deletedCount = await context.Database.ExecuteSqlRawAsync("DELETE FROM ScheduleGames");
                Console.WriteLine($"[DEBUG] Successfully deleted schedule games using raw SQL");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Error deleting schedule games: {ex.Message}");
                Console.WriteLine($"[ERROR] Stack trace: {ex.StackTrace}");
                throw;
            }
        }

        public async Task SeedAsync()
        {
            var seasons = await _seasonRepo.GetAllAsync();
            var locations = await _locationRepo.GetAllAsync();
            var locationsList = locations.ToList();

            if (!locationsList.Any())
            {
                Console.WriteLine("[DEBUG] No locations found, skipping game scheduling.");
                return;
            }

            foreach (var season in seasons)
            {
                var divisions = await _divisionRepo.GetSeasonDivisionsAsync(season.SeasonId);
                var externalScheduleNumber = 1; // Simulate external scheduling program numbering

                foreach (var division in divisions)
                {
                    // Get ScheduleDivTeams for this external schedule number
                    // In real world: this data would already exist from external program import
                    var scheduleDivTeams = await context.ScheduleDivTeams
                        .Where(sdt => sdt.SeasonId == season.SeasonId && sdt.ScheduleNumber == externalScheduleNumber)
                        .ToListAsync();

                    Console.WriteLine($"[DEBUG] Found {scheduleDivTeams.Count} ScheduleDivTeams for Season {season.SeasonId}, Schedule {externalScheduleNumber}");

                    if (scheduleDivTeams.Count >= 2)
                    {
                        Console.WriteLine($"[DEBUG] Generating schedule for External Schedule #{externalScheduleNumber} (Division: {division.DivisionDescription}) with {scheduleDivTeams.Count} teams");

                        // Validate all team mappings exist before proceeding
                        var validationResult = await ValidateTeamMappings(scheduleDivTeams, season.SeasonId, externalScheduleNumber);
                        if (!validationResult.IsValid)
                        {
                            Console.WriteLine($"[ERROR] Team mapping validation failed for Schedule #{externalScheduleNumber}: {validationResult.ErrorMessage}");
                            Console.WriteLine($"[ERROR] Skipping schedule generation for this division to prevent data corruption");
                            continue;
                        }

                        await GenerateScheduleForDivision(season, division, scheduleDivTeams, locationsList, externalScheduleNumber);
                    }
                    else
                    {
                        Console.WriteLine($"[WARNING] Skipping External Schedule #{externalScheduleNumber} (Division: {division.DivisionDescription}) - not enough teams ({scheduleDivTeams.Count})");
                    }

                    externalScheduleNumber++; // Increment for next external schedule group
                }
            }

            // Save all changes to database before playoff seeder runs
            await context.SaveChangesAsync();
            Console.WriteLine("[DEBUG] All schedule games saved to database");
        }

        private async Task GenerateScheduleForDivision(Season season, Division division, List<ScheduleDivTeam> scheduleDivTeams, List<Location> locations, int scheduleNumber)
        {
            var gameSchedule = new List<ScheduleGame>();
            var gameId = 1;

            if (scheduleDivTeams.Count < 2)
            {
                Console.WriteLine($"[DEBUG] Not enough teams in ScheduleDivTeams for Division: {division.DivisionDescription} ({scheduleDivTeams.Count} teams)");
                return;
            }

            Console.WriteLine($"[DEBUG] Using {scheduleDivTeams.Count} ScheduleDivTeams for Division: {division.DivisionDescription}");

            // Generate multiple rounds for a full season (each team plays each other multiple times)
            var totalRounds = (scheduleDivTeams.Count - 1) * 2; // Double round-robin for more games

            // Track when each team last played for rest day enforcement
            var teamLastGameDate = new Dictionary<int, DateTime>();

            // Current scheduling date - start from season start date
            var currentDate = season.FromDate ?? DateTime.Now;

            // Skip to first Monday for weeknight games
            currentDate = GetNextSchedulingDate(currentDate, true);

            var timeSlotManager = new GameTimeSlotManager();

            // Schedule games in batches per game date to create multiple games per day
            var scheduledGamesByDate = new Dictionary<DateTime, List<(ScheduleDivTeam home, ScheduleDivTeam visiting)>>();

            // First, generate all round-robin pairings
            var allRoundPairings = new List<(ScheduleDivTeam home, ScheduleDivTeam visiting)>();
            for (int round = 0; round < totalRounds; round++)
            {
                var roundGames = GenerateRoundRobinRound(scheduleDivTeams, round);
                allRoundPairings.AddRange(roundGames);
            }

            Console.WriteLine($"[DEBUG] Generated {allRoundPairings.Count} total game pairings for the season");

            // Now schedule games to achieve 2-3 games per team per week
            var gameCounter = 0;
            var weekStartDate = GetStartOfWeek(currentDate);
            var gamesScheduledThisWeek = 0;
            var maxGamesPerWeek = Math.Min(scheduleDivTeams.Count * 2, allRoundPairings.Count / 8); // Spread games over ~8 weeks

            foreach (var (homeTeam, visitingTeam) in allRoundPairings)
            {
                if (homeTeam == null || visitingTeam == null)
                {
                    Console.WriteLine($"[WARNING] Null team in round robin pairing");
                    continue;
                }

                // Check if we need to move to next week
                if (gamesScheduledThisWeek >= maxGamesPerWeek)
                {
                    weekStartDate = weekStartDate.AddDays(7);
                    currentDate = weekStartDate;
                    gamesScheduledThisWeek = 0;
                    Console.WriteLine($"[DEBUG] Moving to new week starting {weekStartDate:MMM dd}");
                }

                // Find best date this week considering team rest and available slots
                var gameDate = FindBestDateThisWeek(weekStartDate, homeTeam, visitingTeam, teamLastGameDate, timeSlotManager, locations);

                // Determine if this should be a weeknight or weekend game
                bool isWeekend = gameDate.DayOfWeek == DayOfWeek.Saturday || gameDate.DayOfWeek == DayOfWeek.Sunday;

                // Find location with available slot
                Location selectedLocation = null;
                (string timeString, TimeSpan timeSpan) timeSlotInfo = ("", TimeSpan.Zero);

                foreach (var location in locations)
                {
                    if (timeSlotManager.HasAvailableSlots(gameDate, location.LocationNumber, isWeekend))
                    {
                        selectedLocation = location;
                        timeSlotInfo = timeSlotManager.GetNextAvailableTimeSlot(gameDate, location.LocationNumber, isWeekend);
                        break;
                    }
                }

                // If no location has slots, move to next available date
                if (selectedLocation == null)
                {
                    gameDate = timeSlotManager.GetNextGameDate(gameDate, isWeekend);
                    isWeekend = gameDate.DayOfWeek == DayOfWeek.Saturday || gameDate.DayOfWeek == DayOfWeek.Sunday;
                    selectedLocation = locations[0]; // Use first location
                    timeSlotInfo = timeSlotManager.GetNextAvailableTimeSlot(gameDate, selectedLocation.LocationNumber, isWeekend);
                }

                // Create full DateTime with date and time combined
                var fullGameDateTime = gameDate.Date.Add(timeSlotInfo.timeSpan);

                // Create legacy GameTime format: '1899-12-30 HH:mm:ss' (ignore date, use time only)
                var legacyGameTime = new DateTime(1899, 12, 30).Add(timeSlotInfo.timeSpan).ToString("yyyy-MM-dd HH:mm:ss");

                // Determine if this game is in the past and should have scores
                var isPastGame = fullGameDateTime < DateTime.Now;
                var random = new Random();

                // Validate team numbers before creating the game
                if (homeTeam.TeamNumber <= 0 || visitingTeam.TeamNumber <= 0)
                {
                    Console.WriteLine($"[ERROR] Invalid team numbers for game {gameId}: Home={homeTeam.TeamNumber}, Visiting={visitingTeam.TeamNumber}. Skipping game.");
                    continue;
                }

                // Validate that the team numbers can be looked up in ScheduleDivTeams
                var homeTeamValidation = _scheduleDivTeamsRepo.GetTeamNo(scheduleNumber, homeTeam.ScheduleTeamNumber, season.SeasonId);
                var visitingTeamValidation = _scheduleDivTeamsRepo.GetTeamNo(scheduleNumber, visitingTeam.ScheduleTeamNumber, season.SeasonId);

                if (homeTeamValidation != homeTeam.TeamNumber)
                {
                    Console.WriteLine($"[ERROR] Home team mapping validation failed for game {gameId}: Expected {homeTeam.TeamNumber}, got {homeTeamValidation}. Skipping game.");
                    continue;
                }

                if (visitingTeamValidation != visitingTeam.TeamNumber)
                {
                    Console.WriteLine($"[ERROR] Visiting team mapping validation failed for game {gameId}: Expected {visitingTeam.TeamNumber}, got {visitingTeamValidation}. Skipping game.");
                    continue;
                }

                var game = new ScheduleGame
                {
                    ScheduleNumber = scheduleNumber, // External program's schedule group ID
                    GameNumber = gameId,
                    LocationNumber = selectedLocation.LocationNumber,
                    GameDate = fullGameDateTime, // Now contains both date and time
                    GameTime = legacyGameTime, // Legacy format for transition period
                    HomeTeamNumber = homeTeam.TeamNumber, // From ScheduleDivTeams.TeamNumber
                    VisitingTeamNumber = visitingTeam.TeamNumber, // From ScheduleDivTeams.TeamNumber
                    SeasonId = season.SeasonId, // Would be set manually in real process
                    DivisionId = division.DivisionId, // Would be set manually in real process (mapping external to internal)
                    HomeTeamScore = isPastGame ? random.Next(0, 81) : null, // Random score 0-80 for past games
                    VisitingTeamScore = isPastGame ? random.Next(0, 81) : null, // Random score 0-80 for past games
                    HomeForfeited = false,
                    VisitingForfeited = false
                };

                await _scheduleGameRepo.InsertAsync(game);
                gameId++; // Increment for next game number
                gamesScheduledThisWeek++;
                gameCounter++;

                // Update last game dates for both teams
                teamLastGameDate[homeTeam.TeamNumber] = gameDate;
                teamLastGameDate[visitingTeam.TeamNumber] = gameDate;

                // Log scheduling info for debugging
                if (gameCounter <= 10 || gameCounter % 20 == 0) // Log first 10 and every 20th game
                {
                    Console.WriteLine($"[DEBUG] Game #{gameCounter}: Team {homeTeam.TeamNumber} vs {visitingTeam.TeamNumber} on {gameDate:MMM dd} at {timeSlotInfo.timeString} (Location {selectedLocation.LocationNumber})");
                }
            }

            Console.WriteLine($"[DEBUG] Scheduled {gameCounter} games for Division {division.DivisionDescription}");
        }

        private DateTime GetStartOfWeek(DateTime date)
        {
            // Get Monday of this week
            var daysFromMonday = (int)date.DayOfWeek - (int)DayOfWeek.Monday;
            if (daysFromMonday < 0) daysFromMonday += 7;
            return date.AddDays(-daysFromMonday);
        }

        private DateTime FindBestDateThisWeek(DateTime weekStart, ScheduleDivTeam team1, ScheduleDivTeam team2,
            Dictionary<int, DateTime> teamLastGameDate, GameTimeSlotManager timeSlotManager, List<Location> locations)
        {
            // Try to find a good date this week (Monday through Sunday)
            for (int day = 0; day < 7; day++)
            {
                var candidateDate = weekStart.AddDays(day);

                // Skip Fridays (no games on Fridays)
                if (candidateDate.DayOfWeek == DayOfWeek.Friday)
                    continue;

                // Check if both teams have adequate rest
                bool team1HasRest = !teamLastGameDate.ContainsKey(team1.TeamNumber) ||
                                   (candidateDate - teamLastGameDate[team1.TeamNumber]).Days >= 1;
                bool team2HasRest = !teamLastGameDate.ContainsKey(team2.TeamNumber) ||
                                   (candidateDate - teamLastGameDate[team2.TeamNumber]).Days >= 1;

                if (team1HasRest && team2HasRest)
                {
                    // Check if any location has available slots
                    bool isWeekend = candidateDate.DayOfWeek == DayOfWeek.Saturday || candidateDate.DayOfWeek == DayOfWeek.Sunday;

                    foreach (var location in locations)
                    {
                        if (timeSlotManager.HasAvailableSlots(candidateDate, location.LocationNumber, isWeekend))
                        {
                            return candidateDate;
                        }
                    }
                }
            }

            // If no good date this week, return next Monday
            return weekStart.AddDays(7);
        }

        private List<(Team home, Team visiting)> GenerateRoundRobinRoundFromTeams(List<Team> teams, int round)
        {
            var games = new List<(Team home, Team visiting)>();
            var teamCount = teams.Count;

            // For odd number of teams, add a "bye" team
            List<Team> workingTeams;
            if (teamCount % 2 == 1)
            {
                workingTeams = new List<Team>(teams) { null }; // null represents bye
                teamCount++;
            }
            else
            {
                workingTeams = new List<Team>(teams);
            }

            // Standard round-robin algorithm
            for (int i = 0; i < teamCount / 2; i++)
            {
                var homeIndex = i;
                var visitingIndex = teamCount - 1 - i;

                // Rotate teams (except the first one)
                if (round > 0)
                {
                    if (homeIndex > 0)
                    {
                        homeIndex = ((homeIndex - 1 + round) % (teamCount - 1)) + 1;
                    }
                    if (visitingIndex > 0)
                    {
                        visitingIndex = ((visitingIndex - 1 + round) % (teamCount - 1)) + 1;
                    }
                }

                var homeTeam = workingTeams[homeIndex];
                var visitingTeam = workingTeams[visitingIndex];

                // Skip games involving the bye team
                if (homeTeam != null && visitingTeam != null)
                {
                    games.Add((homeTeam, visitingTeam));
                }
            }

            return games;
        }

        private DateTime FindNextAvailableDateForTeams(DateTime startDate, Team team1, Team team2, Dictionary<int, DateTime> teamLastGameDate)
        {
            var candidateDate = startDate;

            while (true)
            {
                // Check if both teams have at least one day rest
                bool team1HasRest = !teamLastGameDate.ContainsKey(team1.TeamId) ||
                                   (candidateDate - teamLastGameDate[team1.TeamId]).Days >= 1;
                bool team2HasRest = !teamLastGameDate.ContainsKey(team2.TeamId) ||
                                   (candidateDate - teamLastGameDate[team2.TeamId]).Days >= 1;

                if (team1HasRest && team2HasRest)
                {
                    return candidateDate;
                }

                // Move to next valid game day
                candidateDate = GetNextSchedulingDate(candidateDate.AddDays(1),
                    candidateDate.DayOfWeek == DayOfWeek.Monday || candidateDate.DayOfWeek == DayOfWeek.Tuesday);
            }
        }

        private DateTime FindNextAvailableDate(DateTime startDate, ScheduleDivTeam team1, ScheduleDivTeam team2, Dictionary<int, DateTime> teamLastGameDate)
        {
            var candidateDate = startDate;

            while (true)
            {
                // Check if both teams have at least one day rest
                bool team1HasRest = !teamLastGameDate.ContainsKey(team1.TeamNumber) ||
                                   (candidateDate - teamLastGameDate[team1.TeamNumber]).Days >= 1;
                bool team2HasRest = !teamLastGameDate.ContainsKey(team2.TeamNumber) ||
                                   (candidateDate - teamLastGameDate[team2.TeamNumber]).Days >= 1;

                if (team1HasRest && team2HasRest)
                {
                    return candidateDate;
                }

                // Move to next valid game day
                candidateDate = GetNextSchedulingDate(candidateDate.AddDays(1),
                    candidateDate.DayOfWeek == DayOfWeek.Monday || candidateDate.DayOfWeek == DayOfWeek.Tuesday);
            }
        }

        private DateTime GetNextSchedulingDate(DateTime fromDate, bool preferWeeknight)
        {
            var date = fromDate;

            if (preferWeeknight)
            {
                // Find next Monday, Tuesday, Wednesday, or Thursday
                while (date.DayOfWeek != DayOfWeek.Monday &&
                       date.DayOfWeek != DayOfWeek.Tuesday &&
                       date.DayOfWeek != DayOfWeek.Wednesday &&
                       date.DayOfWeek != DayOfWeek.Thursday)
                {
                    date = date.AddDays(1);
                }
            }
            else
            {
                // Find next Saturday or Sunday
                while (date.DayOfWeek != DayOfWeek.Saturday &&
                       date.DayOfWeek != DayOfWeek.Sunday)
                {
                    date = date.AddDays(1);
                }
            }

            return date;
        }

        private List<(ScheduleDivTeam home, ScheduleDivTeam visiting)> GenerateRoundRobinRound(List<ScheduleDivTeam> scheduleDivTeams, int round)
        {
            var games = new List<(ScheduleDivTeam home, ScheduleDivTeam visiting)>();
            var teamCount = scheduleDivTeams.Count;

            // For odd number of teams, add a "bye" team
            if (teamCount % 2 == 1)
            {
                scheduleDivTeams = new List<ScheduleDivTeam>(scheduleDivTeams) { null }; // null represents bye
                teamCount++;
            }

            // Standard round-robin algorithm
            for (int i = 0; i < teamCount / 2; i++)
            {
                var homeIndex = i;
                var visitingIndex = teamCount - 1 - i;

                // Rotate teams (except the first one)
                if (round > 0)
                {
                    if (homeIndex > 0)
                    {
                        homeIndex = ((homeIndex - 1 + round) % (teamCount - 1)) + 1;
                    }
                    if (visitingIndex > 0)
                    {
                        visitingIndex = ((visitingIndex - 1 + round) % (teamCount - 1)) + 1;
                    }
                }

                var homeTeam = scheduleDivTeams[homeIndex];
                var visitingTeam = scheduleDivTeams[visitingIndex];

                // Skip games involving the bye team
                if (homeTeam != null && visitingTeam != null)
                {
                    games.Add((homeTeam, visitingTeam));
                }
            }

            return games;
        }

        // Helper class to manage game time slots
        internal class GameTimeSlotManager
        {
            private readonly Dictionary<(DateTime date, int location), List<TimeSlot>> _scheduledSlots = new();

            // Define exact time slots as specified
            private readonly TimeSlot[] _weeknightSlots = new[]
            {
                new TimeSlot("6:00 PM", new TimeSpan(18, 0, 0)),
                new TimeSlot("6:50 PM", new TimeSpan(18, 50, 0)),
                new TimeSlot("7:40 PM", new TimeSpan(19, 40, 0)),
                new TimeSlot("8:30 PM", new TimeSpan(20, 30, 0))
            };

            private readonly TimeSlot[] _weekendSlots = new[]
            {
                new TimeSlot("9:00 AM", new TimeSpan(9, 0, 0)),
                new TimeSlot("9:50 AM", new TimeSpan(9, 50, 0)),
                new TimeSlot("10:40 AM", new TimeSpan(10, 40, 0)),
                new TimeSlot("11:30 AM", new TimeSpan(11, 30, 0))
            };

            public (string timeString, TimeSpan timeSpan) GetNextAvailableTimeSlot(DateTime gameDate, int locationNumber, bool isWeekend)
            {
                var key = (gameDate.Date, locationNumber);
                if (!_scheduledSlots.ContainsKey(key))
                {
                    _scheduledSlots[key] = new List<TimeSlot>();
                }

                var scheduledSlots = _scheduledSlots[key];
                var availableSlots = isWeekend ? _weekendSlots : _weeknightSlots;

                foreach (var slot in availableSlots)
                {
                    if (!scheduledSlots.Any(s => s.TimeSpan == slot.TimeSpan))
                    {
                        scheduledSlots.Add(slot);
                        return (slot.TimeString, slot.TimeSpan);
                    }
                }

                // If all slots are taken, start reusing slots (multiple courts scenario)
                var firstSlot = availableSlots[0];
                return (firstSlot.TimeString, firstSlot.TimeSpan);
            }

            public bool HasAvailableSlots(DateTime gameDate, int locationNumber, bool isWeekend)
            {
                var key = (gameDate.Date, locationNumber);
                if (!_scheduledSlots.ContainsKey(key))
                {
                    return true;
                }

                var scheduledSlots = _scheduledSlots[key];
                var availableSlots = isWeekend ? _weekendSlots : _weeknightSlots;

                return scheduledSlots.Count < availableSlots.Length;
            }

            public DateTime GetNextGameDate(DateTime currentDate, bool wasWeekend)
            {
                // For basketball leagues, games happen 2-3 times per week
                // Alternate between weeknight and weekend games, but also schedule mid-week
                if (wasWeekend)
                {
                    // After weekend, next games are Monday/Tuesday
                    return GetNextWeekday(currentDate.AddDays(1));
                }
                else
                {
                    // After weeknight, could be another weeknight or weekend
                    var nextWeeknight = GetNextWeekday(currentDate.AddDays(2)); // Skip one day for rest
                    var nextWeekend = GetNextWeekend(currentDate.AddDays(1));

                    // Prefer weeknight if it's soon, otherwise weekend
                    if ((nextWeeknight - currentDate).Days <= 3)
                    {
                        return nextWeeknight;
                    }
                    return nextWeekend;
                }
            }

            private DateTime GetNextWeekday(DateTime fromDate)
            {
                var date = fromDate;
                while (date.DayOfWeek != DayOfWeek.Monday &&
                       date.DayOfWeek != DayOfWeek.Tuesday &&
                       date.DayOfWeek != DayOfWeek.Wednesday &&
                       date.DayOfWeek != DayOfWeek.Thursday)
                {
                    date = date.AddDays(1);
                }
                return date;
            }

            private DateTime GetNextWeekend(DateTime fromDate)
            {
                var date = fromDate;
                while (date.DayOfWeek != DayOfWeek.Saturday &&
                       date.DayOfWeek != DayOfWeek.Sunday)
                {
                    date = date.AddDays(1);
                }
                return date;
            }
        }

        /// <summary>
        /// Validates that all ScheduleDivTeam entries have proper mappings and data integrity
        /// </summary>
        private Task<ValidationResult> ValidateTeamMappings(List<ScheduleDivTeam> scheduleDivTeams, int seasonId, int scheduleNumber)
        {
            var errors = new List<string>();

            foreach (var team in scheduleDivTeams)
            {
                // Validate basic data integrity
                if (team.TeamNumber <= 0)
                {
                    errors.Add($"Invalid TeamNumber {team.TeamNumber} for ScheduleTeamNumber {team.ScheduleTeamNumber}");
                }

                if (team.ScheduleTeamNumber <= 0)
                {
                    errors.Add($"Invalid ScheduleTeamNumber {team.ScheduleTeamNumber} for TeamNumber {team.TeamNumber}");
                }

                if (team.SeasonId != seasonId)
                {
                    errors.Add($"Season ID mismatch: expected {seasonId}, got {team.SeasonId} for TeamNumber {team.TeamNumber}");
                }

                if (team.ScheduleNumber != scheduleNumber)
                {
                    errors.Add($"Schedule number mismatch: expected {scheduleNumber}, got {team.ScheduleNumber} for TeamNumber {team.TeamNumber}");
                }
            }

            // Validate for duplicate team numbers within the same schedule
            var duplicateTeamNumbers = scheduleDivTeams
                .GroupBy(t => t.TeamNumber)
                .Where(g => g.Count() > 1)
                .Select(g => g.Key);

            foreach (var duplicate in duplicateTeamNumbers)
            {
                errors.Add($"Duplicate TeamNumber {duplicate} found in schedule {scheduleNumber}");
            }

            // Validate for duplicate schedule team numbers
            var duplicateScheduleTeamNumbers = scheduleDivTeams
                .GroupBy(t => t.ScheduleTeamNumber)
                .Where(g => g.Count() > 1)
                .Select(g => g.Key);

            foreach (var duplicate in duplicateScheduleTeamNumbers)
            {
                errors.Add($"Duplicate ScheduleTeamNumber {duplicate} found in schedule {scheduleNumber}");
            }

            // Validate that we can lookup team numbers through the repository
            foreach (var team in scheduleDivTeams)
            {
                var lookupResult = _scheduleDivTeamsRepo.GetTeamNo(scheduleNumber, team.ScheduleTeamNumber, seasonId);
                if (lookupResult != team.TeamNumber)
                {
                    errors.Add($"Team mapping lookup failed: ScheduleTeamNumber {team.ScheduleTeamNumber} should map to TeamNumber {team.TeamNumber}, but got {lookupResult}");
                }
            }

            if (errors.Any())
            {
                return Task.FromResult(new ValidationResult
                {
                    IsValid = false,
                    ErrorMessage = string.Join("; ", errors)
                });
            }

            Console.WriteLine($"[DEBUG] Team mapping validation passed for {scheduleDivTeams.Count} teams in schedule {scheduleNumber}");
            return Task.FromResult(new ValidationResult { IsValid = true });
        }

        private class ValidationResult
        {
            public bool IsValid { get; set; }
            public string ErrorMessage { get; set; } = string.Empty;
        }

        internal class TimeSlot
        {
            public string TimeString { get; }
            public TimeSpan TimeSpan { get; }

            public TimeSlot(string timeString, TimeSpan timeSpan)
            {
                TimeString = timeString;
                TimeSpan = timeSpan;
            }
        }
    }
}
