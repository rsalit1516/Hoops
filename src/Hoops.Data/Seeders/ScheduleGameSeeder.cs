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
        private readonly ITeamRepository _teamRepo;
        private readonly ILocationRepository _locationRepo;

        public ScheduleGameSeeder(
            IScheduleGameRepository scheduleGameRepo,
            ISeasonRepository seasonRepo,
            IDivisionRepository divisionRepo,
            ITeamRepository teamRepo,
            ILocationRepository locationRepo,
            hoopsContext context)
        {
            this.context = context;
            _scheduleGameRepo = scheduleGameRepo;
            _seasonRepo = seasonRepo;
            _divisionRepo = divisionRepo;
            _teamRepo = teamRepo;
            _locationRepo = locationRepo;
        }

        public async Task DeleteAllAsync()
        {
            var records = await _scheduleGameRepo.GetAllAsync();
            Console.WriteLine($"[DEBUG] Found {records.Count()} schedule games to delete");
            foreach (var record in records)
            {
                Console.WriteLine($"[DEBUG] Attempting to delete Schedule Game ID: {record.ScheduleGamesId}");
                await _scheduleGameRepo.DeleteAsync(record.ScheduleGamesId);
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
                    var teams = _teamRepo.GetDivisionTeams(division.DivisionId);
                    var teamsList = teams.ToList();
                    
                    if (teamsList.Count >= 2)
                    {
                        Console.WriteLine($"[DEBUG] Generating schedule for Division: {division.DivisionDescription} with {teamsList.Count} teams");
                        await GenerateScheduleForDivision(season, division, teamsList, locationsList);
                    }
                    else
                    {
                        Console.WriteLine($"[DEBUG] Skipping Division: {division.DivisionDescription} - not enough teams ({teamsList.Count})");
                    }
                }
            }
        }

        private async Task GenerateScheduleForDivision(Season season, Division division, List<Team> teams, List<Location> locations)
        {
            var gameSchedule = new List<ScheduleGame>();
            var gameId = 1;
            var scheduleNumber = division.DivisionId % 100; // Simple schedule number based on division
            
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
                var roundGames = GenerateRoundRobinRound(teams, round);
                
                foreach (var (homeTeam, visitingTeam) in roundGames)
                {
                    // Find next available date considering rest days
                    var gameDate = FindNextAvailableDate(currentDate, homeTeam, visitingTeam, teamLastGameDate);
                    
                    // Determine if this should be a weeknight or weekend game
                    bool isWeekend = gameDate.DayOfWeek == DayOfWeek.Saturday || gameDate.DayOfWeek == DayOfWeek.Sunday;
                    
                    // Get next available time slot for this date and location
                    var location = locations[locationRotation % locations.Count];
                    var timeSlot = timeSlotManager.GetNextAvailableTimeSlot(gameDate, location.LocationNumber, isWeekend);
                    
                    var game = new ScheduleGame
                    {
                        ScheduleGamesId = gameId++,
                        ScheduleNumber = scheduleNumber,
                        GameNumber = gameId,
                        LocationNumber = location.LocationNumber,
                        GameDate = gameDate,
                        GameTime = timeSlot,
                        HomeTeamNumber = int.Parse(homeTeam.TeamNumber),
                        VisitingTeamNumber = int.Parse(visitingTeam.TeamNumber),
                        SeasonId = season.SeasonId,
                        DivisionId = division.DivisionId,
                        HomeTeamScore = null,
                        VisitingTeamScore = null,
                        HomeForfeited = false,
                        VisitingForfeited = false
                    };
                    
                    await _scheduleGameRepo.InsertAsync(game);
                    
                    // Update last game dates for both teams
                    teamLastGameDate[homeTeam.TeamId] = gameDate;
                    teamLastGameDate[visitingTeam.TeamId] = gameDate;
                    
                    locationRotation++;
                    
                    // Move to next potential game date
                    currentDate = timeSlotManager.GetNextGameDate(gameDate, isWeekend);
                }
            }
        }

        private DateTime FindNextAvailableDate(DateTime startDate, Team team1, Team team2, Dictionary<int, DateTime> teamLastGameDate)
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

        private List<(Team home, Team visiting)> GenerateRoundRobinRound(List<Team> teams, int round)
        {
            var games = new List<(Team home, Team visiting)>();
            var teamCount = teams.Count;
            
            // For odd number of teams, add a "bye" team
            if (teamCount % 2 == 1)
            {
                teams = new List<Team>(teams) { null }; // null represents bye
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
                
                var homeTeam = teams[homeIndex];
                var visitingTeam = teams[visitingIndex];
                
                // Skip games involving the bye team
                if (homeTeam != null && visitingTeam != null)
                {
                    games.Add((homeTeam, visitingTeam));
                }
            }
            
            return games;
        }

        // Helper class to manage game time slots
        private class GameTimeSlotManager
        {
            private readonly Dictionary<(DateTime date, int location), List<string>> _scheduledTimes = new();
            
            public string GetNextAvailableTimeSlot(DateTime gameDate, int locationNumber, bool isWeekend)
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
                    var weekendTimes = new[] { "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM" };
                    foreach (var time in weekendTimes)
                    {
                        if (!scheduledTimes.Contains(time))
                        {
                            scheduledTimes.Add(time);
                            return time;
                        }
                    }
                }
                else
                {
                    // Weeknight games: 6:00 PM to 9:00 PM
                    var weeknightTimes = new[] { "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM" };
                    foreach (var time in weeknightTimes)
                    {
                        if (!scheduledTimes.Contains(time))
                        {
                            scheduledTimes.Add(time);
                            return time;
                        }
                    }
                }
                
                // If all slots are taken, return the first available time with a warning
                return isWeekend ? "9:00 AM" : "6:00 PM";
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
