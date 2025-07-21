using Hoops.Core.Models;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Xunit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
            context.ScheduleGames.AddRange(new List<ScheduleGame>
            {
                new ScheduleGame { ScheduleGamesId = 1, SeasonId = 1, GameDate = new DateTime(2024, 6, 1), ScheduleNumber = 100, GameNumber = 1, DivisionId = 10 },
                new ScheduleGame { ScheduleGamesId = 2, SeasonId = 1, GameDate = new DateTime(2024, 6, 2), ScheduleNumber = 100, GameNumber = 2, DivisionId = 10 },
                new ScheduleGame { ScheduleGamesId = 3, SeasonId = 2, GameDate = new DateTime(2024, 7, 1), ScheduleNumber = 200, GameNumber = 1, DivisionId = 20 }
            });
            context.SaveChanges();
            return new ScheduleGameRepository(context, logger);
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
    }
}
