using Hoops.Core.Models;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using Xunit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hoops.Infrastructure.Tests
{
    public class SeasonRepositoryTest
    {
        private SeasonRepository CreateRepositoryWithSeededContext(string? dbName = null)
        {
            var options = new DbContextOptionsBuilder<hoopsContext>()
                .UseInMemoryDatabase(databaseName: dbName ?? Guid.NewGuid().ToString())
                .Options;
            var context = new hoopsContext(options);
            context.Seasons.AddRange(new List<Season>
            {
                new Season { SeasonId = 1, CompanyId = 1, Description = "Spring 2024", FromDate = new DateTime(2024, 3, 1), CurrentSeason = false },
                new Season { SeasonId = 2, CompanyId = 1, Description = "Summer 2024", FromDate = new DateTime(2024, 6, 1), CurrentSeason = true },
                new Season { SeasonId = 3, CompanyId = 2, Description = "Fall 2024", FromDate = new DateTime(2024, 9, 1), CurrentSeason = false }
            });
            context.SaveChanges();
            return new SeasonRepository(context);
        }

        [Fact]
        public async Task GetAllAsync_ReturnsSeasonsForCompany()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            // Act
            var seasons = await repo.GetAllAsync(1);
            // Assert
            Assert.Equal(2, seasons.Count);
        }

        [Fact]
        public void GetSeason_ById_ReturnsCorrectSeason()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            // Act
            var season = repo.GetSeason(1, 2);
            // Assert
            Assert.NotNull(season);
            Assert.Equal(2, season.SeasonId);
        }

        [Fact]
        public async Task GetCurrentSeason_ReturnsCurrentSeason()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            // Act
            var season = await repo.GetCurrentSeason(1);
            // Assert
            Assert.NotNull(season);
            Assert.True(season.CurrentSeason);
        }

        [Fact]
        public void GetSeason_ByDescription_ReturnsSeasonId()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            // Act
            var seasonId = repo.GetSeason(1, "Summer 2024");
            // Assert
            Assert.Equal(2, seasonId);
        }

        [Fact]
        public void GetSeasons_ReturnsAllSeasonsForCompany()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            // Act
            var seasons = repo.GetSeasons(1).ToList();
            // Assert
            Assert.Equal(2, seasons.Count);
        }
    }
}
