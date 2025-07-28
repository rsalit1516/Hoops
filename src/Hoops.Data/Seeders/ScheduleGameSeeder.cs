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
                
                foreach (var division in divisions)
                {
                    // Get ScheduleDivTeams for this division and season
                    var scheduleDivTeams = await context.ScheduleDivTeams
                        .Where(sdt => sdt.SeasonId == season.SeasonId && sdt.DivisionNumber == division.DivisionId)
                        .ToListAsync();
                    
                    if (scheduleDivTeams.Count >= 2)
                    {
                        Console.WriteLine($"[DEBUG] Generating schedule for Division: {division.DivisionDescription} with {scheduleDivTeams.Count} teams");
                        await GenerateScheduleForDivision(season, division, scheduleDivTeams, locationsList);
                    }
                    else
                    {
                        Console.WriteLine($"[DEBUG] Skipping Division: {division.DivisionDescription} - not enough teams ({scheduleDivTeams.Count})");
                    }
                }
            }
        }

        private async Task GenerateScheduleForDivision(Season season, Division division, List<ScheduleDivTeam> scheduleDivTeams, List<Location> locations)
        {
            var gameSchedule = new List<ScheduleGame>();
            var gameId = 1;
            var scheduleNumber = division.DivisionId % 100; // Simple schedule number based on division
            
            // Get actual Teams from Teams table for this division and season
            var teams = await context.Teams
                .Where(t => t.SeasonId == season.SeasonId && t.DivisionId == division.DivisionId)
                .ToListAsync();
            
            if (teams.Count < 2)
            {
                Console.WriteLine($"[DEBUG] Not enough teams in Teams table for Division: {division.DivisionDescription} ({teams.Count} teams)");
                return;
            }
            
            Console.WriteLine($"[DEBUG] Using {teams.Count} teams from Teams table for Division: {division.DivisionDescription}");
            
            // Create a round-robin schedule
            var totalRounds = teams.Count - 1;
            var gamesPerRound = teams.Count / 2;
            
            // Track when each team last played for rest day enforcement
            var teamLastGameDate = new Dictionary<int, DateTime>();
            
            // Current scheduling date - start from season start date
            var currentDate = season.FromDate ?? DateTime.Now;
            
            // Skip to first Monday for weeknight games or first Saturday for weekend games
            currentDate = GetNextSchedulingDate(currentDate, true); // Start with weeknight
            
            var locationRotation = 0;
            var timeSlotManager = new GameTimeSlotManager();
            
            for (int round = 0; round < totalRounds; round++)
            {
                var roundGames = GenerateRoundRobinRoundFromTeams(teams, round);
                
                foreach (var (homeTeam, visitingTeam) in roundGames)
                {
                    if (homeTeam == null || visitingTeam == null)
                    {
                        Console.WriteLine($"[WARNING] Null team in round robin pairing");
                        continue;
                    }
                    
                    // Find next available date considering rest days
                    var gameDate = FindNextAvailableDateForTeams(currentDate, homeTeam, visitingTeam, teamLastGameDate);
                    
                    // Determine if this should be a weeknight or weekend game
                    bool isWeekend = gameDate.DayOfWeek == DayOfWeek.Saturday || gameDate.DayOfWeek == DayOfWeek.Sunday;
                    
                    // Get next available time slot for this date and location
                    var location = locations[locationRotation % locations.Count];
                    var timeSlotInfo = timeSlotManager.GetNextAvailableTimeSlot(gameDate, location.LocationNumber, isWeekend);
                    
                    // Create full DateTime with date and time combined
                    var fullGameDateTime = gameDate.Date.Add(timeSlotInfo.timeSpan);
                    
                    // Create legacy GameTime format: '1899-12-30 HH:mm:ss' (ignore date, use time only)
                    var legacyGameTime = new DateTime(1899, 12, 30).Add(timeSlotInfo.timeSpan).ToString("yyyy-MM-dd HH:mm:ss");
                    
                    // Determine if this game is in the past and should have scores
                    var isPastGame = fullGameDateTime < DateTime.Now;
                    var random = new Random();
                    
                    var game = new ScheduleGame
                    {
                        // Don't set ScheduleGamesId - let Entity Framework auto-generate it
                        ScheduleNumber = scheduleNumber,
                        GameNumber = gameId,
                        LocationNumber = location.LocationNumber,
                        GameDate = fullGameDateTime, // Now contains both date and time
                        GameTime = legacyGameTime, // Legacy format for transition period
                        HomeTeamNumber = homeTeam.TeamId, // Use actual Team.TeamId
                        VisitingTeamNumber = visitingTeam.TeamId, // Use actual Team.TeamId
                        SeasonId = season.SeasonId,
                        DivisionId = division.DivisionId,
                        HomeTeamScore = isPastGame ? random.Next(0, 81) : null, // Random score 0-80 for past games
                        VisitingTeamScore = isPastGame ? random.Next(0, 81) : null, // Random score 0-80 for past games
                        HomeForfeited = false,
                        VisitingForfeited = false
                    };
                    
                    await _scheduleGameRepo.InsertAsync(game);
                    gameId++; // Increment for next game number
                    
                    // Update last game dates for both teams
                    teamLastGameDate[homeTeam.TeamId] = gameDate;
                    teamLastGameDate[visitingTeam.TeamId] = gameDate;
                    
                    locationRotation++;
                    
                    // Move to next potential game date
                    currentDate = timeSlotManager.GetNextGameDate(gameDate, isWeekend);
                }
            }
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
            private readonly Dictionary<(DateTime date, int location), List<string>> _scheduledTimes = new();
            
            public (string timeString, TimeSpan timeSpan) GetNextAvailableTimeSlot(DateTime gameDate, int locationNumber, bool isWeekend)
            {
                var key = (gameDate.Date, locationNumber);
                if (!_scheduledTimes.ContainsKey(key))
                {
                    _scheduledTimes[key] = new List<string>();
                }
                
                var scheduledTimes = _scheduledTimes[key];
                
                if (isWeekend)
                {
                    // Weekend games: 9:00 AM to 12:00 PM
                    var weekendTimes = new[] 
                    { 
                        ("9:00 AM", new TimeSpan(9, 0, 0)),
                        ("10:00 AM", new TimeSpan(10, 0, 0)),
                        ("11:00 AM", new TimeSpan(11, 0, 0)),
                        ("12:00 PM", new TimeSpan(12, 0, 0))
                    };
                    
                    foreach (var (timeString, timeSpan) in weekendTimes)
                    {
                        if (!scheduledTimes.Contains(timeString))
                        {
                            scheduledTimes.Add(timeString);
                            return (timeString, timeSpan);
                        }
                    }
                    
                    // If all slots are taken, return the first available time
                    return ("9:00 AM", new TimeSpan(9, 0, 0));
                }
                else
                {
                    // Weeknight games: 6:00 PM to 9:00 PM
                    var weeknightTimes = new[] 
                    { 
                        ("6:00 PM", new TimeSpan(18, 0, 0)),
                        ("7:00 PM", new TimeSpan(19, 0, 0)),
                        ("8:00 PM", new TimeSpan(20, 0, 0)),
                        ("9:00 PM", new TimeSpan(21, 0, 0))
                    };
                    
                    foreach (var (timeString, timeSpan) in weeknightTimes)
                    {
                        if (!scheduledTimes.Contains(timeString))
                        {
                            scheduledTimes.Add(timeString);
                            return (timeString, timeSpan);
                        }
                    }
                    
                    // If all slots are taken, return the first available time
                    return ("6:00 PM", new TimeSpan(18, 0, 0));
                }
            }
            
            public DateTime GetNextGameDate(DateTime currentDate, bool wasWeekend)
            {
                // Alternate between weeknight and weekend games
                if (wasWeekend)
                {
                    return GetNextWeekday(currentDate.AddDays(1));
                }
                else
                {
                    return GetNextWeekend(currentDate.AddDays(1));
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
    }
}
