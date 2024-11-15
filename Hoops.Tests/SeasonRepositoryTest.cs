using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;
using Hoops.Core.Models;
using Hoops.Infrastructure.Repository;

namespace Hoops.Core.Repository.Tests
{
    public class SeasonRepositoryTest
    {
        private readonly Mock<hoopsContext> _mockContext;
        private readonly SeasonRepository _repository;

        public SeasonRepositoryTest()
        {
            _mockContext = new Mock<hoopsContext>();
            _repository = new SeasonRepository(_mockContext.Object);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnSeasons_WhenCompanyIdIsValid()
        {
            // Arrange
            var companyId = 1;
            var seasons = new List<Season>
            {
                new Season { CompanyId = companyId, FromDate = DateTime.Now.AddYears(-1) },
                new Season { CompanyId = companyId, FromDate = DateTime.Now }
            }.AsQueryable();

            var mockSet = new Mock<DbSet<Season>>();
            mockSet.As<IQueryable<Season>>().Setup(m => m.Provider).Returns(seasons.Provider);
            mockSet.As<IQueryable<Season>>().Setup(m => m.Expression).Returns(seasons.Expression);
            mockSet.As<IQueryable<Season>>().Setup(m => m.ElementType).Returns(seasons.ElementType);
            mockSet.As<IQueryable<Season>>().Setup(m => m.GetEnumerator()).Returns(seasons.GetEnumerator());

            _mockContext.Setup(c => c.Seasons).Returns(mockSet.Object);

            // Act
            var result = await _repository.GetAllAsync(companyId);

            // Assert
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public void GetSeason_ShouldReturnSeason_WhenCompanyIdAndSeasonIdAreValid()
        {
            // Arrange
            var companyId = 1;
            var seasonId = 1;
            var seasons = new List<Season>
            {
                new Season { CompanyId = companyId, SeasonId = seasonId }
            }.AsQueryable();

            var mockSet = new Mock<DbSet<Season>>();
            mockSet.As<IQueryable<Season>>().Setup(m => m.Provider).Returns(seasons.Provider);
            mockSet.As<IQueryable<Season>>().Setup(m => m.Expression).Returns(seasons.Expression);
            mockSet.As<IQueryable<Season>>().Setup(m => m.ElementType).Returns(seasons.ElementType);
            mockSet.As<IQueryable<Season>>().Setup(m => m.GetEnumerator()).Returns(seasons.GetEnumerator());

            _mockContext.Setup(c => c.Set<Season>()).Returns(mockSet.Object);

            // Act
            var result = _repository.GetSeason(companyId, seasonId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(seasonId, result.SeasonId);
        }

        [Fact]
        public async Task GetCurrentSeason_ShouldReturnCurrentSeason_WhenCompanyIdIsValid()
        {
            // Arrange
            var companyId = 1;
            var seasons = new List<Season>
            {
                new Season { CompanyId = companyId, CurrentSeason = true }
            }.AsQueryable();

            var mockSet = new Mock<DbSet<Season>>();
            mockSet.As<IQueryable<Season>>().Setup(m => m.Provider).Returns(seasons.Provider);
            mockSet.As<IQueryable<Season>>().Setup(m => m.Expression).Returns(seasons.Expression);
            mockSet.As<IQueryable<Season>>().Setup(m => m.ElementType).Returns(seasons.ElementType);
            mockSet.As<IQueryable<Season>>().Setup(m => m.GetEnumerator()).Returns(seasons.GetEnumerator());

            _mockContext.Setup(c => c.Set<Season>()).Returns(mockSet.Object);

            // Act
            var result = await _repository.GetCurrentSeason(companyId);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.CurrentSeason);
        }

        [Fact]
        public void GetSeason_ShouldReturnSeasonId_WhenCompanyIdAndDescriptionAreValid()
        {
            // Arrange
            var companyId = 1;
            var description = "Test Season";
            var seasonId = 1;
            var seasons = new List<Season>
            {
                new Season { CompanyId = companyId, Description = description, SeasonId = seasonId }
            }.AsQueryable();

            var mockSet = new Mock<DbSet<Season>>();
            mockSet.As<IQueryable<Season>>().Setup(m => m.Provider).Returns(seasons.Provider);
            mockSet.As<IQueryable<Season>>().Setup(m => m.Expression).Returns(seasons.Expression);
            mockSet.As<IQueryable<Season>>().Setup(m => m.ElementType).Returns(seasons.ElementType);
            mockSet.As<IQueryable<Season>>().Setup(m => m.GetEnumerator()).Returns(seasons.GetEnumerator());

            _mockContext.Setup(c => c.Set<Season>()).Returns(mockSet.Object);

            // Act
            var result = _repository.GetSeason(companyId, description);

            // Assert
            Assert.Equal(seasonId, result);
        }

        [Fact]
        public void GetSeasons_ShouldReturnSeasons_WhenCompanyIdIsValid()
        {
            // Arrange
            var companyId = 1;
            var seasons = new List<Season>
            {
                new Season { CompanyId = companyId, FromDate = DateTime.Now.AddYears(-1) },
                new Season { CompanyId = companyId, FromDate = DateTime.Now }
            }.AsQueryable();

            var mockSet = new Mock<DbSet<Season>>();
            mockSet.As<IQueryable<Season>>().Setup(m => m.Provider).Returns(seasons.Provider);
            mockSet.As<IQueryable<Season>>().Setup(m => m.Expression).Returns(seasons.Expression);
            mockSet.As<IQueryable<Season>>().Setup(m => m.ElementType).Returns(seasons.ElementType);
            mockSet.As<IQueryable<Season>>().Setup(m => m.GetEnumerator()).Returns(seasons.GetEnumerator());

            _mockContext.Setup(c => c.Set<Season>()).Returns(mockSet.Object);

            // Act
            var result = _repository.GetSeasons(companyId);

            // Assert
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public void GetSeasonCountsSimple_ShouldReturnSeasonCounts_WhenSeasonIdIsValid()
        {
            // Arrange
            var seasonId = 1;
            var seasons = new List<Season>
            {
                new Season { SeasonId = seasonId }
            }.AsQueryable();

            var divisions = new List<Division>
            {
                new Division { SeasonId = seasonId, DivisionId = 1, DivisionDescription = "Division 1" }
            }.AsQueryable();

            var players = new List<Player>
            {
                new Player { DivisionId = 1, PlayerId = 1 },
                new Player { DivisionId = 1, PlayerId = 2 }
            }.AsQueryable();

            var mockSeasonSet = new Mock<DbSet<Season>>();
            mockSeasonSet.As<IQueryable<Season>>().Setup(m => m.Provider).Returns(seasons.Provider);
            mockSeasonSet.As<IQueryable<Season>>().Setup(m => m.Expression).Returns(seasons.Expression);
            mockSeasonSet.As<IQueryable<Season>>().Setup(m => m.ElementType).Returns(seasons.ElementType);
            mockSeasonSet.As<IQueryable<Season>>().Setup(m => m.GetEnumerator()).Returns(seasons.GetEnumerator());

            var mockDivisionSet = new Mock<DbSet<Division>>();
            mockDivisionSet.As<IQueryable<Division>>().Setup(m => m.Provider).Returns(divisions.Provider);
            mockDivisionSet.As<IQueryable<Division>>().Setup(m => m.Expression).Returns(divisions.Expression);
            mockDivisionSet.As<IQueryable<Division>>().Setup(m => m.ElementType).Returns(divisions.ElementType);
            mockDivisionSet.As<IQueryable<Division>>().Setup(m => m.GetEnumerator()).Returns(divisions.GetEnumerator());

            var mockPlayerSet = new Mock<DbSet<Player>>();
            mockPlayerSet.As<IQueryable<Player>>().Setup(m => m.Provider).Returns(players.Provider);
            mockPlayerSet.As<IQueryable<Player>>().Setup(m => m.Expression).Returns(players.Expression);
            mockPlayerSet.As<IQueryable<Player>>().Setup(m => m.ElementType).Returns(players.ElementType);
            mockPlayerSet.As<IQueryable<Player>>().Setup(m => m.GetEnumerator()).Returns(players.GetEnumerator());

            _mockContext.Setup(c => c.Set<Season>()).Returns(mockSeasonSet.Object);
            _mockContext.Setup(c => c.Set<Division>()).Returns(mockDivisionSet.Object);
            _mockContext.Setup(c => c.Set<Player>()).Returns(mockPlayerSet.Object);

            // Act
            var result = _repository.GetSeasonCountsSimple(seasonId);

            // Assert
            Assert.Single(result);
            Assert.Equal("Division 1", result.First().Div_Desc);
            Assert.Equal(2, result.First().Total);
        }
    }
}