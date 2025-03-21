using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace Hoops.Infrastructure.Tests.Repository
{
    public class DivisionRepositoryTest
    {
        [Fact]
        public async Task GetSeasonDivisionsAsync_ReturnsDivisions_ForGivenSeasonId()
        {
            // Arrange
            var seasonId = 1;
            var divisions = new List<Division>
            {
                new Division { DivisionId = 1, SeasonId = seasonId, MinDate = new DateTime(2022, 1, 1) },
                new Division { DivisionId = 2, SeasonId = seasonId, MinDate = new DateTime(2022, 2, 1) }
            }.AsQueryable();

            var mockSet = new Mock<DbSet<Division>>();
            mockSet.As<IQueryable<Division>>().Setup(m => m.Provider).Returns(divisions.Provider);
            mockSet.As<IQueryable<Division>>().Setup(m => m.Expression).Returns(divisions.Expression);
            mockSet.As<IQueryable<Division>>().Setup(m => m.ElementType).Returns(divisions.ElementType);
            mockSet.As<IQueryable<Division>>().Setup(m => m.GetEnumerator()).Returns(divisions.GetEnumerator());

            var mockContext = new Mock<hoopsContext>();
            mockContext.Setup(c => c.Divisions).Returns(mockSet.Object);

            var repository = new DivisionRepository(mockContext.Object);

            // Act
            var result = await repository.GetSeasonDivisionsAsync(seasonId);

            // Assert
            Assert.Equal(2, result.Count());
            Assert.Equal(1, result.First().DivisionId);
            Assert.Equal(2, result.Last().DivisionId);
        }

        [Fact]
        public async Task GetSeasonDivisionsAsync_ReturnsEmptyList_WhenNoDivisionsForGivenSeasonId()
        {
            // Arrange
            var seasonId = 1;
            var divisions = new List<Division>().AsQueryable();

            var mockSet = new Mock<DbSet<Division>>();
            mockSet.As<IQueryable<Division>>().Setup(m => m.Provider).Returns(divisions.Provider);
            mockSet.As<IQueryable<Division>>().Setup(m => m.Expression).Returns(divisions.Expression);
            mockSet.As<IQueryable<Division>>().Setup(m => m.ElementType).Returns(divisions.ElementType);
            mockSet.As<IQueryable<Division>>().Setup(m => m.GetEnumerator()).Returns(divisions.GetEnumerator());

            var mockContext = new Mock<hoopsContext>();
            mockContext.Setup(c => c.Divisions).Returns(mockSet.Object);

            var repository = new DivisionRepository(mockContext.Object);

            // Act
            var result = await repository.GetSeasonDivisionsAsync(seasonId);

            // Assert
            Assert.Empty(result);
        }
    }
}