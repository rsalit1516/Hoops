using Hoops.Core.ViewModels;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;

namespace Hoops.Infrastructure.Tests
{
    public class SchedulePlayoffRepositoryTests
    {
        private readonly hoopsContext _context;
        private readonly SchedulePlayoffRepository _repository;

        public SchedulePlayoffRepositoryTests(TestDatabaseFixture fixture)
        {
            _context = fixture.Context ?? throw new ArgumentNullException(nameof(fixture.Context), "Context cannot be null");
            _repository = new SchedulePlayoffRepository(_context);

        }

        [Fact]
        public void GetGamesBySeasonId_ShouldReturnGamesVm()
        {
            // Arrange
            var seasonId = 1;

            // Act
            var gamesVm = _repository.GetGamesBySeasonId(seasonId);

            // Assert
            Assert.NotNull(gamesVm);
            Assert.IsType<List<PlayoffGameVm>>(gamesVm);
        }
    }
}