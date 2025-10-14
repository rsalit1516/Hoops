using Hoops.Core.Models;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
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
            var options = new DbContextOptionsBuilder<hoopsContext>()
                .UseInMemoryDatabase(databaseName: $"divisions_db_{Guid.NewGuid()}")
                .Options;

            using var ctx = new hoopsContext(options);
            ctx.Divisions.AddRange(
                new Division { DivisionId = 1, SeasonId = seasonId, MinDate = new DateTime(2022, 1, 1) },
                new Division { DivisionId = 2, SeasonId = seasonId, MinDate = new DateTime(2022, 2, 1) }
            );
            await ctx.SaveChangesAsync();

            var repository = new DivisionRepository(ctx);

            // Act
            var result = await repository.GetSeasonDivisionsAsync(seasonId);

            // Assert
            var list = result.ToList();
            Assert.Equal(2, list.Count);
            Assert.Contains(list, d => d.DivisionId == 1);
            Assert.Contains(list, d => d.DivisionId == 2);
        }

        [Fact]
        public async Task GetSeasonDivisionsAsync_ReturnsEmptyList_WhenNoDivisionsForGivenSeasonId()
        {
            // Arrange
            var seasonId = 1;
            var options = new DbContextOptionsBuilder<hoopsContext>()
                .UseInMemoryDatabase(databaseName: $"divisions_db_{Guid.NewGuid()}")
                .Options;

            using var ctx = new hoopsContext(options);
            await ctx.SaveChangesAsync();

            var repository = new DivisionRepository(ctx);

            // Act
            var result = await repository.GetSeasonDivisionsAsync(seasonId);

            // Assert
            Assert.Empty(result);
        }
    }
}
