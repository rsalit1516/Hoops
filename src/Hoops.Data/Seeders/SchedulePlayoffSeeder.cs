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
    /// <summary>
    /// Seeds playoff games following tournament bracket structure.
    /// Generates playoff brackets for all divisions except T2 divisions.
    /// </summary>
    public class SchedulePlayoffSeeder : ISeeder<SchedulePlayoff>
    {
        public hoopsContext context { get; private set; }
        private readonly ISchedulePlayoffRepository _schedulePlayoffRepo;
        private readonly ISeasonRepository _seasonRepo;
        private readonly IDivisionRepository _divisionRepo;
        private readonly ILocationRepository _locationRepo;
        private readonly IScheduleGameRepository _scheduleGameRepo;
        private readonly ILogger<SchedulePlayoffSeeder> _logger;

        public SchedulePlayoffSeeder(
            ISchedulePlayoffRepository schedulePlayoffRepo,
            ISeasonRepository seasonRepo,
            IDivisionRepository divisionRepo,
            ILocationRepository locationRepo,
            IScheduleGameRepository scheduleGameRepo,
            hoopsContext context,
            ILogger<SchedulePlayoffSeeder> logger)
        {
            this.context = context;
            _schedulePlayoffRepo = schedulePlayoffRepo;
            _seasonRepo = seasonRepo;
            _divisionRepo = divisionRepo;
            _locationRepo = locationRepo;
            _scheduleGameRepo = scheduleGameRepo;
            _logger = logger;
        }

        public async Task DeleteAllAsync()
        {
            try
            {
                _logger.LogDebug("Attempting to delete all schedule playoff games");

                // Check if using in-memory database (for tests)
                var isInMemory = context.Database.ProviderName == "Microsoft.EntityFrameworkCore.InMemory";

                if (isInMemory)
                {
                    // For in-memory database, use EF operations
                    var existingGames = context.SchedulePlayoffs.ToList();
                    context.SchedulePlayoffs.RemoveRange(existingGames);
                    await context.SaveChangesAsync();
                    _logger.LogDebug("Successfully deleted {Count} schedule playoff games using EF", existingGames.Count);
                }
                else
                {
                    // For SQL database, use raw SQL for better performance
                    var deletedCount = await context.Database.ExecuteSqlRawAsync("DELETE FROM SchedulePlayoffs");
                    _logger.LogDebug("Successfully deleted schedule playoff games using raw SQL");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting schedule playoff games: {Message}", ex.Message);
                throw;
            }
        }

        public async Task SeedAsync()
        {
            _logger.LogInformation("=============================================================");
            _logger.LogInformation("               PLAYOFF SEEDER STARTING");
            _logger.LogInformation("=============================================================");
            _logger.LogDebug("Starting playoff seeding process");

            var seasons = await _seasonRepo.GetAllAsync();
            var divisions = await _divisionRepo.GetAllAsync();
            var locations = await _locationRepo.GetAllAsync();
            var locationsList = locations.ToList();
            var scheduleGames = await _scheduleGameRepo.GetAllAsync();

            _logger.LogDebug("Found {LocationCount} locations", locationsList.Count);
            if (!locationsList.Any())
            {
                _logger.LogDebug("No locations found, skipping playoff game scheduling.");
                return;
            }

            // Track used playoff schedule numbers to ensure global uniqueness
            var usedPlayoffScheduleNumbers = new HashSet<int>();

            foreach (var season in seasons)
            {
                _logger.LogDebug("Processing season: {SeasonDescription}", season.Description);

                // Get divisions for this season
                var seasonDivisions = divisions.Where(d => d.SeasonId == season.SeasonId).ToList();

                foreach (var division in seasonDivisions)
                {
                    // Skip T2 divisions - they don't have playoffs
                    if (division.DivisionDescription?.Contains("T2", StringComparison.OrdinalIgnoreCase) == true)
                    {
                        _logger.LogDebug("Skipping playoff generation for T2 division {DivisionId}: {DivisionDescription}", division.DivisionId, division.DivisionDescription);
                        continue;
                    }

                    // Check if playoffs already exist for this division
                    var existingPlayoffs = await GetPlayoffsByDivisionAsync(division.DivisionId);
                    if (existingPlayoffs.Any())
                    {
                        _logger.LogDebug("Playoffs already exist for division {DivisionId}. Skipping.", division.DivisionId);
                        continue;
                    }

                    // Get team count and last game date for this division
                    var divisionInfo = await GetDivisionPlayoffInfoAsync(division.DivisionId, season.SeasonId);

                    if (divisionInfo.TeamCount < 4)
                    {
                        _logger.LogDebug("Division {DivisionId} has {TeamCount} teams. Minimum 4 required for playoffs. Skipping.", division.DivisionId, divisionInfo.TeamCount);
                        continue;
                    }

                    if (!divisionInfo.LastGameDate.HasValue)
                    {
                        _logger.LogDebug("No games found for division {DivisionId}. Skipping playoff generation.", division.DivisionId);
                        continue;
                    }

                    // Generate unique playoff schedule number
                    var playoffScheduleNumber = GenerateUniquePlayoffScheduleNumber(division.DivisionId, usedPlayoffScheduleNumbers);
                    usedPlayoffScheduleNumbers.Add(playoffScheduleNumber);

                    _logger.LogDebug("Generating playoffs for Division {DivisionId} ({DivisionDescription}) with {TeamCount} teams", division.DivisionId, division.DivisionDescription, divisionInfo.TeamCount);

                    await GeneratePlayoffsForDivisionAsync(division, divisionInfo, playoffScheduleNumber, locationsList);
                }
            }

            _logger.LogDebug("Playoff seeding completed");
        }

        private async Task<List<SchedulePlayoff>> GetPlayoffsByDivisionAsync(int divisionId)
        {
            return await context.SchedulePlayoffs
                .Where(sp => sp.DivisionId == divisionId)
                .ToListAsync();
        }

        private async Task<DivisionPlayoffInfo> GetDivisionPlayoffInfoAsync(int divisionId, int seasonId)
        {
            _logger.LogDebug("Getting playoff info for Division {DivisionId}, Season {SeasonId}", divisionId, seasonId);

            // Try querying directly from context instead of repository
            var totalGames = await context.ScheduleGames.CountAsync();
            _logger.LogDebug("Total games in ScheduleGames table (direct context): {TotalGames}", totalGames);

            // Also try the repository approach
            var scheduleGames = await _scheduleGameRepo.GetAllAsync();
            var totalGamesRepo = scheduleGames.Count();
            _logger.LogDebug("Total games via repository: {TotalGames}", totalGamesRepo);

            // Let's also check what DivisionIds exist in ScheduleGames (direct context)
            var divisionIds = await context.ScheduleGames
                .Select(sg => sg.DivisionId)
                .Distinct()
                .OrderBy(id => id)
                .ToListAsync();
            _logger.LogDebug("DivisionIds in ScheduleGames (direct): {DivisionIds}", string.Join(", ", divisionIds));

            // Get all schedule games for this division (using direct context)
            var divisionGames = await context.ScheduleGames
                .Where(sg => sg.DivisionId.HasValue && sg.DivisionId.Value == divisionId)
                .ToListAsync();

            _logger.LogDebug("Found {GameCount} games for Division {DivisionId}", divisionGames.Count, divisionId);

            if (!divisionGames.Any())
            {
                _logger.LogDebug("No games found for Division {DivisionId}", divisionId);
                return new DivisionPlayoffInfo { TeamCount = 0, LastGameDate = null };
            }

            // Count unique teams
            var allTeams = new HashSet<int>();
            foreach (var game in divisionGames)
            {
                if (game.VisitingTeamNumber.HasValue)
                {
                    allTeams.Add(game.VisitingTeamNumber.Value);
                    _logger.LogDebug("Added visiting team: {TeamNumber}", game.VisitingTeamNumber.Value);
                }
                if (game.HomeTeamNumber.HasValue)
                {
                    allTeams.Add(game.HomeTeamNumber.Value);
                    _logger.LogDebug("Added home team: {TeamNumber}", game.HomeTeamNumber.Value);
                }
            }

            _logger.LogDebug("Total unique teams found: {TeamCount}", allTeams.Count);

            // Get latest game date
            var lastGameDate = divisionGames.Max(g => g.GameDate);
            _logger.LogDebug("Last game date: {LastGameDate}", lastGameDate);

            return new DivisionPlayoffInfo
            {
                TeamCount = allTeams.Count,
                LastGameDate = lastGameDate
            };
        }

        private async Task GeneratePlayoffsForDivisionAsync(Division division, DivisionPlayoffInfo divisionInfo, int playoffScheduleNumber, List<Location> locations)
        {
            _logger.LogDebug("Playoff generation started for division: {DivisionId}", division.DivisionId);
            var startDate = divisionInfo.LastGameDate!.Value.AddDays(1); // Start at least one day after last regular season game
            var gameNumber = 1;

            // Determine if this is a weekend division (T4) or weeknight division
            var isWeekendDivision = division.DivisionDescription?.Contains("T4", StringComparison.OrdinalIgnoreCase) == true;

            var playoffGames = GeneratePlayoffBracket(division, divisionInfo.TeamCount, startDate, isWeekendDivision, playoffScheduleNumber, ref gameNumber);

            // Schedule games with proper timing and locations
            await SchedulePlayoffGamesAsync(playoffGames, locations, isWeekendDivision);

            _logger.LogDebug("Generated {GameCount} playoff games for division {DivisionId}", playoffGames.Count, division.DivisionId);
        }

        private List<PlayoffGameInfo> GeneratePlayoffBracket(Division division, int teamCount, DateTime startDate, bool isWeekendDivision, int scheduleNumber, ref int gameNumber)
        {
            var playoffGames = new List<PlayoffGameInfo>();
            var currentDate = GetNextGameDate(startDate, isWeekendDivision);

            // Generate quarterfinals (if 8+ teams)
            if (teamCount >= 8)
            {
                playoffGames.AddRange(GenerateQuarterfinals(division.DivisionId, scheduleNumber, currentDate, isWeekendDivision, ref gameNumber));
                currentDate = GetNextGameDate(currentDate.AddDays(isWeekendDivision ? 7 : 1), isWeekendDivision);
            }

            // Generate semifinals (always needed for 4+ teams)
            playoffGames.AddRange(GenerateSemifinals(division.DivisionId, scheduleNumber, currentDate, isWeekendDivision, teamCount, ref gameNumber));
            currentDate = GetNextGameDate(currentDate.AddDays(isWeekendDivision ? 7 : 1), isWeekendDivision);

            // Generate championship
            playoffGames.AddRange(GenerateChampionship(division.DivisionId, scheduleNumber, currentDate, isWeekendDivision, ref gameNumber));

            return playoffGames;
        }

        private DateTime GetNextGameDate(DateTime fromDate, bool isWeekendDivision)
        {
            if (isWeekendDivision)
            {
                // Weekend divisions play on Saturday or Sunday
                var nextSaturday = fromDate.Date.AddDays((6 - (int)fromDate.DayOfWeek + 7) % 7);
                if (nextSaturday == fromDate.Date && fromDate.TimeOfDay < TimeSpan.FromHours(9))
                    return nextSaturday; // Same day if before 9 AM
                return nextSaturday.Date == fromDate.Date ? nextSaturday.AddDays(7) : nextSaturday;
            }
            else
            {
                // Weeknight divisions - find next weekday (Monday-Friday)
                var nextDay = fromDate.Date.AddDays(1);
                while (nextDay.DayOfWeek == DayOfWeek.Saturday || nextDay.DayOfWeek == DayOfWeek.Sunday)
                {
                    nextDay = nextDay.AddDays(1);
                }
                return nextDay;
            }
        }

        private List<PlayoffGameInfo> GenerateQuarterfinals(int divisionId, int scheduleNumber, DateTime gameDate, bool isWeekendDivision, ref int gameNumber)
        {
            _logger.LogDebug("Generating quarterfinals for division: {DivisionId}", divisionId);
            var games = new List<PlayoffGameInfo>();
            var gameTime = isWeekendDivision ? TimeSpan.FromHours(9) : TimeSpan.FromHours(18); // 9 AM weekends, 6 PM weeknights

            // Generate 4 quarterfinal games: 1v8, 2v7, 3v6, 4v5
            var matchups = new[] { (1, 8), (2, 7), (3, 6), (4, 5) };

            for (int i = 0; i < matchups.Length; i++)
            {
                var currentGameTime = gameTime.Add(TimeSpan.FromMinutes(i * 90)); // 90 minutes apart

                games.Add(new PlayoffGameInfo
                {
                    DivisionId = divisionId,
                    GameNumber = gameNumber++,
                    ScheduleNumber = scheduleNumber,
                    GameDate = gameDate,
                    GameTime = currentGameTime,
                    VisitingTeam = $"Team {matchups[i].Item2}",
                    HomeTeam = $"Team {matchups[i].Item1}",
                    Description = "Quarterfinal"
                });
            }

            return games;
        }

        private List<PlayoffGameInfo> GenerateSemifinals(int divisionId, int scheduleNumber, DateTime gameDate, bool isWeekendDivision, int teamCount, ref int gameNumber)
        {
            _logger.LogDebug("Generating semifinals for division: {DivisionId}", divisionId);
            var games = new List<PlayoffGameInfo>();
            var gameTime = isWeekendDivision ? TimeSpan.FromHours(9) : TimeSpan.FromHours(18);

            if (teamCount >= 8)
            {
                // Semifinals after quarterfinals: winners advance
                games.Add(new PlayoffGameInfo
                {
                    DivisionId = divisionId,
                    GameNumber = gameNumber++,
                    ScheduleNumber = scheduleNumber,
                    GameDate = gameDate,
                    GameTime = gameTime,
                    VisitingTeam = "QF Winner 2",
                    HomeTeam = "QF Winner 1",
                    Description = "Semifinal"
                });

                games.Add(new PlayoffGameInfo
                {
                    DivisionId = divisionId,
                    GameNumber = gameNumber++,
                    ScheduleNumber = scheduleNumber,
                    GameDate = gameDate,
                    GameTime = gameTime.Add(TimeSpan.FromMinutes(90)),
                    VisitingTeam = "QF Winner 4",
                    HomeTeam = "QF Winner 3",
                    Description = "Semifinal"
                });
            }
            else
            {
                // Direct semifinals for 4-6 teams: 1v4, 2v3
                games.Add(new PlayoffGameInfo
                {
                    DivisionId = divisionId,
                    GameNumber = gameNumber++,
                    ScheduleNumber = scheduleNumber,
                    GameDate = gameDate,
                    GameTime = gameTime,
                    VisitingTeam = "Team 4",
                    HomeTeam = "Team 1",
                    Description = "Semifinal"
                });

                games.Add(new PlayoffGameInfo
                {
                    DivisionId = divisionId,
                    GameNumber = gameNumber++,
                    ScheduleNumber = scheduleNumber,
                    GameDate = gameDate,
                    GameTime = gameTime.Add(TimeSpan.FromMinutes(90)),
                    VisitingTeam = "Team 3",
                    HomeTeam = "Team 2",
                    Description = "Semifinal"
                });
            }

            return games;
        }

        private List<PlayoffGameInfo> GenerateChampionship(int divisionId, int scheduleNumber, DateTime gameDate, bool isWeekendDivision, ref int gameNumber)
        {
            _logger.LogDebug("Generating championship for division: {DivisionId}", divisionId);
            var games = new List<PlayoffGameInfo>();
            var gameTime = isWeekendDivision ? TimeSpan.FromHours(10, 30) : TimeSpan.FromHours(18); // 10:30 AM championship on weekends

            games.Add(new PlayoffGameInfo
            {
                DivisionId = divisionId,
                GameNumber = gameNumber++,
                ScheduleNumber = scheduleNumber,
                GameDate = gameDate,
                GameTime = gameTime,
                VisitingTeam = "SF Winner 2",
                HomeTeam = "SF Winner 1",
                Description = "Championship"
            });

            return games;
        }

        private async Task SchedulePlayoffGamesAsync(List<PlayoffGameInfo> playoffGames, List<Location> locations, bool isWeekendDivision)
        {
            _logger.LogDebug("Generating schedule playoffs game");
            _logger.LogDebug("locations: {LocationCount}", locations.Count);
            var gameCounter = 0;

            foreach (var playoffGame in playoffGames)
            {
                gameCounter++;
                var selectedLocation = locations[gameCounter % locations.Count]; // Rotate through locations

                // Create full DateTime with date and time combined
                var fullGameDateTime = playoffGame.GameDate.Date.Add(playoffGame.GameTime);

                // Create GameTime in AM/PM format to match frontend expectations
                // Format: "06:00:00 PM" - required by Angular Material timepicker and playoff-game.service
                var gameTimeAmPm = new DateTime(1899, 12, 30).Add(playoffGame.GameTime).ToString("hh:mm:ss tt");

                // Create the SchedulePlayoff entity
                var game = new SchedulePlayoff
                {
                    ScheduleNumber = playoffGame.ScheduleNumber,
                    GameNumber = playoffGame.GameNumber,
                    LocationNumber = selectedLocation.LocationNumber,
                    GameDate = fullGameDateTime,
                    GameTime = gameTimeAmPm,
                    HomeTeam = playoffGame.HomeTeam,
                    VisitingTeam = playoffGame.VisitingTeam,
                    Descr = playoffGame.Description,
                    DivisionId = playoffGame.DivisionId,
                    HomeTeamScore = null, // No scores initially
                    VisitingTeamScore = null
                };

                // Insert and save each game individually
                await _schedulePlayoffRepo.InsertAsync(game);
                await context.SaveChangesAsync();

                _logger.LogDebug("Playoff Game #{GameCounter}: {HomeTeam} vs {VisitingTeam} - {Description} on {GameDate:MMM dd} at {GameTime}", gameCounter, playoffGame.HomeTeam, playoffGame.VisitingTeam, playoffGame.Description, playoffGame.GameDate, playoffGame.GameTime);
            }
        }

        private int GenerateUniquePlayoffScheduleNumber(int divisionId, HashSet<int> usedNumbers)
        {
            // Start with a playoff-specific range (e.g., 10000+) to avoid conflicts with regular schedule numbers
            var playoffBaseNumber = 10000 + divisionId;

            // If this number is already used, increment until we find a unique one
            while (usedNumbers.Contains(playoffBaseNumber))
            {
                playoffBaseNumber++;
            }

            return playoffBaseNumber;
        }

        // Helper classes to structure playoff information
        private class DivisionPlayoffInfo
        {
            public int TeamCount { get; set; }
            public DateTime? LastGameDate { get; set; }
        }

        private class PlayoffGameInfo
        {
            public int DivisionId { get; set; }
            public int ScheduleNumber { get; set; }
            public int GameNumber { get; set; }
            public DateTime GameDate { get; set; }
            public TimeSpan GameTime { get; set; }
            public string HomeTeam { get; set; }
            public string VisitingTeam { get; set; }
            public string Description { get; set; }
        }
    }
}
