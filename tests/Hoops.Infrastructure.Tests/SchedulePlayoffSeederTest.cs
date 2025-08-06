using System;
using System.Threading.Tasks;
using Hoops.Data.Seeders;
using Hoops.Infrastructure.Tests;
using Hoops.Infrastructure.Repository;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace Hoops.Infrastructure.Tests
{
    /// <summary>
    /// Basic tests for SchedulePlayoffSeeder to verify compilation and basic functionality
    /// </summary>
    public class SchedulePlayoffSeederTest : IClassFixture<TestDatabaseFixture>
    {
        private readonly TestDatabaseFixture _fixture;

        public SchedulePlayoffSeederTest(TestDatabaseFixture fixture)
        {
            _fixture = fixture;
        }

        [Fact]
        public void Constructor_WithValidParameters_ShouldCreateInstance()
        {
            // Arrange & Act
            var schedulePlayoffRepo = new SchedulePlayoffRepository(_fixture.Context!);
            var seasonRepo = new SeasonRepository(_fixture.Context!);
            var divisionRepo = new DivisionRepository(_fixture.Context!);
            var locationRepo = new LocationRepository(_fixture.Context!);
            var scheduleGameRepo = new ScheduleGameRepository(_fixture.Context!, NullLogger<ScheduleGameRepository>.Instance);
            
            var seeder = new SchedulePlayoffSeeder(
                schedulePlayoffRepo,
                seasonRepo,
                divisionRepo,
                locationRepo,
                scheduleGameRepo,
                _fixture.Context!
            );
            
            // Assert
            Assert.NotNull(seeder);
        }

        [Fact]
        public async Task DeleteAllAsync_ShouldExecuteWithoutError()
        {
            // Arrange
            var schedulePlayoffRepo = new SchedulePlayoffRepository(_fixture.Context!);
            var seasonRepo = new SeasonRepository(_fixture.Context!);
            var divisionRepo = new DivisionRepository(_fixture.Context!);
            var locationRepo = new LocationRepository(_fixture.Context!);
            var scheduleGameRepo = new ScheduleGameRepository(_fixture.Context!, NullLogger<ScheduleGameRepository>.Instance);
            
            var seeder = new SchedulePlayoffSeeder(
                schedulePlayoffRepo,
                seasonRepo,
                divisionRepo,
                locationRepo,
                scheduleGameRepo,
                _fixture.Context!
            );
            
            // Act & Assert - Should not throw
            await seeder.DeleteAllAsync();
        }

        [Fact]
        public async Task SeedAsync_WithEmptyDatabase_ShouldExecuteWithoutError()
        {
            // Arrange
            var schedulePlayoffRepo = new SchedulePlayoffRepository(_fixture.Context!);
            var seasonRepo = new SeasonRepository(_fixture.Context!);
            var divisionRepo = new DivisionRepository(_fixture.Context!);
            var locationRepo = new LocationRepository(_fixture.Context!);
            var scheduleGameRepo = new ScheduleGameRepository(_fixture.Context!, NullLogger<ScheduleGameRepository>.Instance);
            
            var seeder = new SchedulePlayoffSeeder(
                schedulePlayoffRepo,
                seasonRepo,
                divisionRepo,
                locationRepo,
                scheduleGameRepo,
                _fixture.Context!
            );
            
            // Act & Assert - Should not throw
            await seeder.SeedAsync();
        }
    }
}
