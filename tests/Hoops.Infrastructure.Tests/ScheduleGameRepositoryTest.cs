using Hoops.Core.Models;
using Hoops.Core.ViewModels;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Xunit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static Hoops.Core.Enum.GroupTypes;

namespace Hoops.Infrastructure.Tests
{
    public class ScheduleGameRepositoryTest
    {
        private ScheduleGameRepository CreateRepositoryWithSeededContext(string? dbName = null)
        {
            var options = new DbContextOptionsBuilder<hoopsContext>()
                .UseInMemoryDatabase(databaseName: dbName ?? Guid.NewGuid().ToString())
                .Options;
            var context = new hoopsContext(options);
            var logger = new LoggerFactory().CreateLogger<ScheduleGameRepository>();
            
            // Seed comprehensive test data
            SeedTestData(context);
            context.SaveChanges();
            
            return new ScheduleGameRepository(context, logger);
        }

        private void SeedTestData(hoopsContext context)
        {
            // Add Seasons
            context.Seasons.AddRange(new List<Season>
            {
                new Season { SeasonId = 1, Description = "2024 Spring", CurrentSeason = true },
                new Season { SeasonId = 2, Description = "2024 Fall", CurrentSeason = false }
            });

            // Add Colors
            context.Colors.AddRange(new List<Color>
            {
                new Color { ColorId = 1, ColorName = "Red", CompanyId = 1 },
                new Color { ColorId = 2, ColorName = "Blue", CompanyId = 1 },
                new Color { ColorId = 3, ColorName = "Green", CompanyId = 1 },
                new Color { ColorId = 4, ColorName = "Yellow", CompanyId = 1 }
            });

            // Add Divisions
            context.Divisions.AddRange(new List<Division>
            {
                new Division { DivisionId = 10, DivisionDescription = "T1 - Boys", SeasonId = 1 },
                new Division { DivisionId = 20, DivisionDescription = "T2 - Coed", SeasonId = 1 }
            });

            // Add Locations
            context.Location.AddRange(new List<Location>
            {
                new Location { LocationNumber = 101, LocationName = "Gym A" },
                new Location { LocationNumber = 102, LocationName = "Gym B" }
            });

            // Add Teams
            context.Teams.AddRange(new List<Team>
            {
                new Team { TeamId = 1, TeamNumber = "1", TeamName = "Red Team", DivisionId = 10, SeasonId = 1, TeamColorId = 1 },
                new Team { TeamId = 2, TeamNumber = "2", TeamName = "Blue Team", DivisionId = 10, SeasonId = 1, TeamColorId = 2 },
                new Team { TeamId = 3, TeamNumber = "3", TeamName = "Green Team", DivisionId = 20, SeasonId = 1, TeamColorId = 3 },
                new Team { TeamId = 4, TeamNumber = "4", TeamName = "Yellow Team", DivisionId = 20, SeasonId = 1, TeamColorId = 4 }
            });

            // Add ScheduleDivTeams (mapping between teams and schedule numbers)
            context.ScheduleDivTeams.AddRange(new List<ScheduleDivTeam>
            {
                new ScheduleDivTeam { ScheduleDivTeamsId = 1, SeasonId = 1, ScheduleNumber = 100, TeamNumber = 1, ScheduleTeamNumber = 1 },
                new ScheduleDivTeam { ScheduleDivTeamsId = 2, SeasonId = 1, ScheduleNumber = 100, TeamNumber = 2, ScheduleTeamNumber = 2 },
                new ScheduleDivTeam { ScheduleDivTeamsId = 3, SeasonId = 1, ScheduleNumber = 200, TeamNumber = 3, ScheduleTeamNumber = 3 },
                new ScheduleDivTeam { ScheduleDivTeamsId = 4, SeasonId = 1, ScheduleNumber = 200, TeamNumber = 4, ScheduleTeamNumber = 4 }
            });

            // Add ScheduleGames
            context.ScheduleGames.AddRange(new List<ScheduleGame>
            {
                new ScheduleGame 
                { 
                    ScheduleGamesId = 1, 
                    SeasonId = 1, 
                    GameDate = new DateTime(2024, 6, 1), 
                    GameTime = "18:00",
                    ScheduleNumber = 100, 
                    GameNumber = 1, 
                    DivisionId = 10,
                    LocationNumber = 101,
                    HomeTeamNumber = 1,
                    VisitingTeamNumber = 2,
                    HomeTeamScore = 85,
                    VisitingTeamScore = 78
                },
                new ScheduleGame 
                { 
                    ScheduleGamesId = 2, 
                    SeasonId = 1, 
                    GameDate = new DateTime(2024, 6, 2), 
                    GameTime = "19:00",
                    ScheduleNumber = 200, 
                    GameNumber = 1, 
                    DivisionId = 20,
                    LocationNumber = 102,
                    HomeTeamNumber = 3,
                    VisitingTeamNumber = 4,
                    HomeTeamScore = 72,
                    VisitingTeamScore = 69
                },
                new ScheduleGame 
                { 
                    ScheduleGamesId = 3, 
                    SeasonId = 2, 
                    GameDate = new DateTime(2024, 7, 1), 
                    GameTime = "18:30",
                    ScheduleNumber = 300, 
                    GameNumber = 1, 
                    DivisionId = 20,
                    LocationNumber = 101,
                    HomeTeamNumber = 4,
                    VisitingTeamNumber = 3,
                    HomeTeamScore = 0,
                    VisitingTeamScore = 0
                }
            });
        }

        [Fact]
        public async Task GetSeasonGamesAsync_ReturnsGamesForSeason()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            // Act
            var games = await repo.GetSeasonGamesAsync(1);
            // Assert
            Assert.Equal(2, games.Count());
        }

        [Fact]
        public void GetByDate_ReturnsGamesOnDate()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            var date = new DateTime(2024, 6, 1);
            // Act
            var games = repo.GetByDate(date).ToList();
            // Assert
            Assert.Single(games);
            Assert.Equal(date, games[0].GameDate);
        }

        [Fact]
        public void GetByScheduleGamesId_ReturnsCorrectGame()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            // Act
            var game = repo.GetByScheduleGamesId(2);
            // Assert
            Assert.NotNull(game);
            Assert.Equal(2, game.ScheduleGamesId);
        }

        [Fact]
        public void Insert_AddsGame()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            var newGame = new ScheduleGame { SeasonId = 1, GameDate = new DateTime(2024, 6, 3), ScheduleNumber = 100, DivisionId = 10 };
            // Act
            repo.Insert(newGame);
            repo.SaveChanges();
            // Assert
            var found = repo.GetByDate(new DateTime(2024, 6, 3)).FirstOrDefault();
            Assert.NotNull(found);
            Assert.Equal(new DateTime(2024, 6, 3), found.GameDate);
        }

        [Fact]
        public void GetGames_ReturnsVmGameScheduleWithTeamNames()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            
            // Act
            var games = repo.GetGames(1);
            
            // Assert
            Assert.NotNull(games);
            Assert.Equal(2, games.Count);
            
            var firstGame = games.First();
            Assert.NotNull(firstGame.HomeTeamName);
            Assert.NotNull(firstGame.VisitingTeamName);
            Assert.NotNull(firstGame.LocationName);
            Assert.Equal("Red Team", firstGame.HomeTeamName);
            Assert.Equal("Blue Team", firstGame.VisitingTeamName);
            Assert.Equal("Gym A", firstGame.LocationName);
        }

        [Fact]
        public void GetGames_ReturnsEmptyList_WhenNoGamesExist()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            
            // Act
            var games = repo.GetGames(999); // Non-existent season
            
            // Assert
            Assert.NotNull(games);
            Assert.Empty(games);
        }

        [Fact]
        public void GetGames_SetsCorrectGameType()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            
            // Act
            var games = repo.GetGames(1);
            
            // Assert
            Assert.All(games, game => Assert.Equal(GameTypes.Regular, game.GameType));
        }

        [Fact]
        public void GetGames_CombinesDateAndTime()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            
            // Act
            var games = repo.GetGames(1);
            
            // Assert
            var firstGame = games.First();
            Assert.Equal(new DateTime(2024, 6, 1, 18, 0, 0), firstGame.GameDate);
        }

        [Fact]
        public void GetStandings_ReturnsStandingsForDivision()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            
            // Act
            var standings = repo.GetStandings(1, 10);
            
            // Assert
            Assert.NotNull(standings);
            Assert.Equal(2, standings.Count()); // Should have 2 teams in division 10
            
            var homeTeamStanding = standings.FirstOrDefault(s => s.TeamName == "Red Team");
            Assert.NotNull(homeTeamStanding);
            Assert.Equal(1, homeTeamStanding.Won); // Won the game 85-78
            Assert.Equal(0, homeTeamStanding.Lost);
            Assert.Equal(85, homeTeamStanding.PF); // Points for
            Assert.Equal(78, homeTeamStanding.PA); // Points against
        }

        [Fact]
        public void GetStandings_CalculatesCorrectPercentage()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            
            // Act
            var standings = repo.GetStandings(1, 10);
            
            // Assert
            var winningTeam = standings.FirstOrDefault(s => s.Won > 0);
            Assert.NotNull(winningTeam);
            Assert.Equal(100m, winningTeam.Pct); // 1 win, 0 losses = 100%
        }

        [Fact]
        public void GetStandings_OrdersByWinPercentage()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            
            // Act
            var standings = repo.GetStandings(1, 10).ToList();
            
            // Assert
            Assert.True(standings[0].Pct >= standings[1].Pct);
        }

        [Fact]
        public void GetStandings_ReturnsEmptyForNonExistentDivision()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            
            // Act
            var standings = repo.GetStandings(1, 999); // Non-existent division
            
            // Assert
            Assert.NotNull(standings);
            Assert.Empty(standings);
        }

        [Fact]
        public void GetByScheduleAndGameNo_ReturnsCorrectGame()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            
            // Act
            var game = repo.GetByScheduleAndGameNo(100, 1);
            
            // Assert
            Assert.NotNull(game);
            Assert.Equal(100, game.ScheduleNumber);
            Assert.Equal(1, game.GameNumber);
        }

        [Fact]
        public void GetByScheduleAndGameNo_ReturnsEmptyGame_WhenNotFound()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            
            // Act
            var game = repo.GetByScheduleAndGameNo(999, 999);
            
            // Assert
            Assert.NotNull(game);
            Assert.Equal(0, game.ScheduleGamesId); // Default value for new ScheduleGame
        }

        [Fact]
        public void GetSeasonGames_ByDivision_ReturnsCorrectGames()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            
            // Act
            var games = repo.GetSeasonGames(10);
            
            // Assert
            Assert.Single(games);
            Assert.Equal(10, games.First().DivisionId);
        }

        [Fact]
        public void Delete_RemovesGame()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            var gameToDelete = repo.GetByScheduleGamesId(1);
            
            // Act
            repo.Delete(gameToDelete);
            
            // Assert
            var deletedGame = repo.GetByScheduleGamesId(1);
            Assert.Equal(0, deletedGame.ScheduleGamesId); // Should return empty game
        }

        [Fact]
        public void Insert_SetsCorrectGameNumber()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            var newGame = new ScheduleGame 
            { 
                SeasonId = 1, 
                GameDate = new DateTime(2024, 6, 10), 
                ScheduleNumber = 100, 
                DivisionId = 10,
                GameNumber = 0 // Should be auto-assigned
            };
            
            // Act
            var insertedGame = repo.Insert(newGame);
            
            // Assert
            Assert.Equal(2, insertedGame.GameNumber); // Should be next number in schedule (1 already exists)
        }

        [Fact]
        public void Exists_ReturnsTrueForExistingGame()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            
            // Act & Assert
            Assert.True(repo.Exists(1));
            Assert.False(repo.Exists(999));
        }
    }
}
