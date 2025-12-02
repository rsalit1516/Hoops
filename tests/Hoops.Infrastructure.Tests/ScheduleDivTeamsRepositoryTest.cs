using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Xunit;
using Hoops.Core.Models;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;

namespace Hoops.Infrastructure.Tests
{
    public class ScheduleDivTeamsRepositoryTest
    {
        private hoopsContext GetInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<hoopsContext>()
                .UseInMemoryDatabase(databaseName: System.Guid.NewGuid().ToString())
                .Options;

            var context = new hoopsContext(options);
            SeedTestData(context);
            return context;
        }

        private void SeedTestData(hoopsContext context)
        {
            // Add test ScheduleDivTeams data
            context.ScheduleDivTeams.AddRange(new List<ScheduleDivTeam>
            {
                // Season 1, Schedule 100 - Different teams with different mappings
                new ScheduleDivTeam { ScheduleDivTeamsId = 1, SeasonId = 1, ScheduleNumber = 100, TeamNumber = 101, ScheduleTeamNumber = 1 },
                new ScheduleDivTeam { ScheduleDivTeamsId = 2, SeasonId = 1, ScheduleNumber = 100, TeamNumber = 102, ScheduleTeamNumber = 2 },
                new ScheduleDivTeam { ScheduleDivTeamsId = 3, SeasonId = 1, ScheduleNumber = 100, TeamNumber = 103, ScheduleTeamNumber = 3 },
                
                // Season 1, Schedule 200 - Same team numbers but different schedule
                new ScheduleDivTeam { ScheduleDivTeamsId = 4, SeasonId = 1, ScheduleNumber = 200, TeamNumber = 201, ScheduleTeamNumber = 1 },
                new ScheduleDivTeam { ScheduleDivTeamsId = 5, SeasonId = 1, ScheduleNumber = 200, TeamNumber = 202, ScheduleTeamNumber = 2 },
                
                // Season 2, Schedule 100 - Same schedule/team numbers but different season
                new ScheduleDivTeam { ScheduleDivTeamsId = 6, SeasonId = 2, ScheduleNumber = 100, TeamNumber = 301, ScheduleTeamNumber = 1 },
                new ScheduleDivTeam { ScheduleDivTeamsId = 7, SeasonId = 2, ScheduleNumber = 100, TeamNumber = 302, ScheduleTeamNumber = 2 }
            });

            context.SaveChanges();
        }

        [Fact]
        public void GetTeamNo_WithValidScheduleAndTeamNumber_ReturnsCorrectTeamNumber()
        {
            // Arrange
            using var context = GetInMemoryContext();
            var repository = new ScheduleDivTeamsRepository(context);

            // Act
            var result = repository.GetTeamNo(100, 1); // Schedule 100, Team 1

            // Assert
            Assert.Equal(101, result); // Should return the first match (Season 1)
        }

        [Fact]
        public void GetTeamNo_WithValidScheduleTeamAndSeason_ReturnsCorrectTeamNumber()
        {
            // Arrange
            using var context = GetInMemoryContext();
            var repository = new ScheduleDivTeamsRepository(context);

            // Act - Season 1
            var result1 = repository.GetTeamNo(100, 1, 1); // Schedule 100, Team 1, Season 1
            // Act - Season 2
            var result2 = repository.GetTeamNo(100, 1, 2); // Schedule 100, Team 1, Season 2

            // Assert
            Assert.Equal(101, result1); // Season 1 mapping
            Assert.Equal(301, result2); // Season 2 mapping
        }

        [Fact]
        public void GetTeamNo_WithDifferentSchedules_ReturnsDifferentTeamNumbers()
        {
            // Arrange
            using var context = GetInMemoryContext();
            var repository = new ScheduleDivTeamsRepository(context);

            // Act
            var schedule100Team1 = repository.GetTeamNo(100, 1, 1); // Schedule 100, Team 1, Season 1
            var schedule200Team1 = repository.GetTeamNo(200, 1, 1); // Schedule 200, Team 1, Season 1

            // Assert
            Assert.Equal(101, schedule100Team1); // Schedule 100 mapping
            Assert.Equal(201, schedule200Team1); // Schedule 200 mapping
        }

        [Fact]
        public void GetTeamNo_WithInvalidData_ReturnsZero()
        {
            // Arrange
            using var context = GetInMemoryContext();
            var repository = new ScheduleDivTeamsRepository(context);

            // Act
            var invalidSchedule = repository.GetTeamNo(999, 1); // Non-existent schedule
            var invalidTeam = repository.GetTeamNo(100, 999); // Non-existent team
            var invalidSeason = repository.GetTeamNo(100, 1, 999); // Non-existent season

            // Assert
            Assert.Equal(0, invalidSchedule);
            Assert.Equal(0, invalidTeam);
            Assert.Equal(0, invalidSeason);
        }
    }
}
