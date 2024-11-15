using System.Collections.Generic;
using Hoops.Core.ViewModels;
using Hoops.Infrastructure.Repository;
using Xunit;

namespace Hoops.Core.Tests.Repository
{
    public class SchedulePlayoffRepositoryTests
    {
        [Fact]
        public void GetGamesBySeasonId_ShouldReturnGamesVm()
        {
            // Arrange
            var repository = new SchedulePlayoffRepository();
            var seasonId = 1;

            // Act
            var gamesVm = repository.GetGamesBySeasonId(seasonId);

            // Assert
            Assert.NotNull(gamesVm);
            Assert.IsType<List<PlayoffGameVm>>(gamesVm);
        }
    }
}