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
    public class SchedulePlayoffSeeder : ISeeder<SchedulePlayoff>
    {
        public hoopsContext context { get; private set; }
        private readonly ISchedulePlayoffRepository _schedulePlayoffRepo;
        private readonly ISeasonRepository _seasonRepo;
        private readonly IDivisionRepository _divisionRepo;
        private readonly ILocationRepository _locationRepo;

        public SchedulePlayoffSeeder(
            ISchedulePlayoffRepository schedulePlayoffRepo,
            ISeasonRepository seasonRepo,
            IDivisionRepository divisionRepo,
            ILocationRepository locationRepo,
            hoopsContext context)
        {
            this.context = context;
            _schedulePlayoffRepo = schedulePlayoffRepo;
            _seasonRepo = seasonRepo;
            _divisionRepo = divisionRepo;
            _locationRepo = locationRepo;
        }

        public async Task DeleteAllAsync()
        {
            try
            {
                Console.WriteLine("[DEBUG] Attempting to delete all schedule playoff games");
                
                // Check if using in-memory database (for tests)
                var isInMemory = context.Database.ProviderName == "Microsoft.EntityFrameworkCore.InMemory";
                
                if (isInMemory)
                {
                    // For in-memory database, use EF operations
                    var existingGames = context.SchedulePlayoffs.ToList();
                    context.SchedulePlayoffs.RemoveRange(existingGames);
                    await context.SaveChangesAsync();
                    Console.WriteLine($"[DEBUG] Successfully deleted {existingGames.Count} schedule playoff games using EF");
                }
                else
                {
                    // For SQL database, use raw SQL for better performance
                    var deletedCount = await context.Database.ExecuteSqlRawAsync("DELETE FROM SchedulePlayoffs");
                    Console.WriteLine($"[DEBUG] Successfully deleted schedule playoff games using raw SQL");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Error deleting schedule playoff games: {ex.Message}");
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
                Console.WriteLine("[DEBUG] No locations found, skipping playoff game scheduling.");
                return;
            }

            foreach (var season in seasons)
            {
                var divisions = await _divisionRepo.GetSeasonDivisionsAsync(season.SeasonId);
                var externalScheduleNumber = 1; // Start with schedule number 1 for playoffs
                
                foreach (var division in divisions)
                {
                    // Get the number of teams in this division from ScheduleDivTeams
                    var teamCount = await context.ScheduleDivTeams
                        .Where(sdt => sdt.SeasonId == season.SeasonId && sdt.ScheduleNumber == externalScheduleNumber)
                        .CountAsync();
                    
                    if (teamCount >= 4) // Need at least 4 teams for playoffs
                    {
                        Console.WriteLine($"[DEBUG] Generating playoff schedule for Division: {division.DivisionDescription} with {teamCount} teams");
                        await GeneratePlayoffScheduleForDivision(season, division, teamCount, locationsList, externalScheduleNumber);
                    }
                    else
                    {
                        Console.WriteLine($"[DEBUG] Skipping playoffs for Division: {division.DivisionDescription} - not enough teams ({teamCount})");
                    }
                    
                    externalScheduleNumber++; // Increment for next division
                }
            }
        }

        private async Task GeneratePlayoffScheduleForDivision(Season season, Division division, int teamCount, List<Location> locations, int scheduleNumber)
        {
            // Calculate playoff start date (after regular season ends - 2 weeks before season ToDate)
            var playoffStartDate = season.ToDate?.AddDays(-14) ?? DateTime.Now.AddDays(7);
            
            // Generate playoff bracket games
            var playoffGames = GeneratePlayoffBracket(teamCount, scheduleNumber, division.DivisionId);
            
            var gameDate = GetNextWeekend(playoffStartDate); // Start playoffs on weekend
            var gameCounter = 0;
            
            foreach (var playoffGame in playoffGames)
            {
                gameCounter++;
                
                // Determine game time based on game number
                var gameTime = GetPlayoffGameTime(gameCounter);
                var selectedLocation = locations[gameCounter % locations.Count]; // Rotate through locations
                
                // Create full DateTime with date and time combined
                var fullGameDateTime = gameDate.Date.Add(gameTime);
                
                // Create legacy GameTime format
                var legacyGameTime = new DateTime(1899, 12, 30).Add(gameTime).ToString("yyyy-MM-dd HH:mm:ss");
                
                // All playoff games are in the future initially (no scores)
                var game = new SchedulePlayoff
                {
                    ScheduleNumber = playoffGame.ScheduleNumber,
                    GameNumber = playoffGame.GameNumber,
                    LocationNumber = selectedLocation.LocationNumber,
                    GameDate = fullGameDateTime,
                    GameTime = legacyGameTime,
                    HomeTeam = playoffGame.HomeTeam,
                    VisitingTeam = playoffGame.VisitingTeam,
                    Descr = playoffGame.Description,
                    DivisionId = playoffGame.DivisionId,
                    HomeTeamScore = null, // No scores initially
                    VisitingTeamScore = null
                };
                
                await _schedulePlayoffRepo.InsertAsync(game);
                
                // Log playoff game creation
                if (gameCounter <= 10 || gameCounter % 5 == 0)
                {
                    Console.WriteLine($"[DEBUG] Playoff Game #{gameCounter}: {playoffGame.HomeTeam} vs {playoffGame.VisitingTeam} - {playoffGame.Description} on {gameDate:MMM dd} at {gameTime}");
                }
                
                // Move to next weekend for next round (every 4 games)
                if (gameCounter % 4 == 0)
                {
                    gameDate = gameDate.AddDays(7);
                }
            }
            
            await context.SaveChangesAsync();
            Console.WriteLine($"[DEBUG] Scheduled {gameCounter} playoff games for Division {division.DivisionDescription}");
        }

        private List<PlayoffGameInfo> GeneratePlayoffBracket(int teamCount, int scheduleNumber, int divisionId)
        {
            var playoffGames = new List<PlayoffGameInfo>();
            var gameNumber = 1;
            
            // Generate playoff bracket based on team standings
            // Last place vs First place, Second-to-last vs Second place, etc.
            
            // Quarterfinals (if 8+ teams) or Semifinals (if 4-6 teams)
            if (teamCount >= 8)
            {
                // Quarterfinals - Last place vs First place pattern
                for (int i = 0; i < 4; i++)
                {
                    var homeTeamRank = i + 1; // 1st, 2nd, 3rd, 4th place
                    var visitingTeamRank = teamCount - i; // Last, 2nd-to-last, etc.
                    
                    playoffGames.Add(new PlayoffGameInfo
                    {
                        ScheduleNumber = scheduleNumber,
                        GameNumber = gameNumber++,
                        HomeTeam = $"Team {homeTeamRank}",
                        VisitingTeam = $"Team {visitingTeamRank}",
                        Description = "Quarterfinal",
                        DivisionId = divisionId
                    });
                }
                
                // Semifinals
                playoffGames.Add(new PlayoffGameInfo
                {
                    ScheduleNumber = scheduleNumber,
                    GameNumber = gameNumber++,
                    HomeTeam = "Winner QF1",
                    VisitingTeam = "Winner QF4",
                    Description = "Semifinal",
                    DivisionId = divisionId
                });
                
                playoffGames.Add(new PlayoffGameInfo
                {
                    ScheduleNumber = scheduleNumber,
                    GameNumber = gameNumber++,
                    HomeTeam = "Winner QF2",
                    VisitingTeam = "Winner QF3",
                    Description = "Semifinal",
                    DivisionId = divisionId
                });
            }
            else if (teamCount >= 4)
            {
                // Direct to Semifinals - Last place vs First place pattern
                var pairs = teamCount / 2;
                for (int i = 0; i < pairs; i++)
                {
                    var homeTeamRank = i + 1;
                    var visitingTeamRank = teamCount - i;
                    
                    playoffGames.Add(new PlayoffGameInfo
                    {
                        ScheduleNumber = scheduleNumber,
                        GameNumber = gameNumber++,
                        HomeTeam = $"Team {homeTeamRank}",
                        VisitingTeam = $"Team {visitingTeamRank}",
                        Description = "Semifinal",
                        DivisionId = divisionId
                    });
                }
            }
            
            // Championship Game
            playoffGames.Add(new PlayoffGameInfo
            {
                ScheduleNumber = scheduleNumber,
                GameNumber = gameNumber++,
                HomeTeam = "Winner SF1",
                VisitingTeam = "Winner SF2",
                Description = "Championship",
                DivisionId = divisionId
            });
            
            return playoffGames;
        }

        private TimeSpan GetPlayoffGameTime(int gameNumber)
        {
            // Playoff games typically on weekends
            // Saturday: 9:00 AM, 11:00 AM, 1:00 PM, 3:00 PM
            // Sunday: 9:00 AM, 11:00 AM, 1:00 PM, 3:00 PM
            
            var timeSlots = new[]
            {
                new TimeSpan(9, 0, 0),   // 9:00 AM
                new TimeSpan(11, 0, 0),  // 11:00 AM
                new TimeSpan(13, 0, 0),  // 1:00 PM
                new TimeSpan(15, 0, 0)   // 3:00 PM
            };
            
            return timeSlots[(gameNumber - 1) % timeSlots.Length];
        }

        private DateTime GetNextWeekend(DateTime fromDate)
        {
            var date = fromDate;
            while (date.DayOfWeek != DayOfWeek.Saturday)
            {
                date = date.AddDays(1);
            }
            return date;
        }

        // Helper class to structure playoff game information
        private class PlayoffGameInfo
        {
            public int ScheduleNumber { get; set; }
            public int GameNumber { get; set; }
            public string HomeTeam { get; set; }
            public string VisitingTeam { get; set; }
            public string Description { get; set; }
            public int DivisionId { get; set; }
        }
    }
}
