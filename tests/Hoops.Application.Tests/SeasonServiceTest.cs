using Xunit;

namespace Hoops.Application.Tests
{
    public class SeasonServiceTest
    {
        [Fact]
        public async Task GetCurrentSeason_ReturnsActiveSeason()
        {
            // Arrange
            var repo = new TestSeasonRepository();
            var season = new Hoops.Core.Models.Season { SeasonId = 1, CompanyId = 1, Description = "Summer 2025", CurrentSeason = true };
            repo.AddSeason(season);
            var service = new Hoops.Application.Services.SeasonService(repo);

            // Act
            var result = await service.GetCurrentSeasonAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.SeasonId);
            Assert.True(result.CurrentSeason);
        }
    }
}
