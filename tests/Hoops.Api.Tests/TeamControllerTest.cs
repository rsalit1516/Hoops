using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using Hoops.Controllers;
using Microsoft.Extensions.Logging;

namespace Hoops.Api.Tests
{
    public class TeamControllerTest
    {
        [Fact]
        public async Task GetTeams_ReturnsOkResult_WithTeams()
        {
            var mockRepo = new Mock<ITeamRepository>();
            var mockLogger = new Mock<ILogger<TeamController>>();
            var expectedTeams = new List<Team> { new Team { TeamId = 1, TeamName = "Test Team" } };
            mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(expectedTeams);
            var controller = new TeamController(mockRepo.Object, mockLogger.Object);
            var result = await controller.GetTeams();
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var teams = Assert.IsAssignableFrom<IEnumerable<Team>>(okResult.Value);
            Assert.Single(teams);
        }

        [Fact]
        public async Task GetTeamById_ReturnsOkResult_WhenTeamExists()
        {
            var mockRepo = new Mock<ITeamRepository>();
            var mockLogger = new Mock<ILogger<TeamController>>();
            var team = new Team { TeamId = 2, TeamName = "Team 2" };
            mockRepo.Setup(r => r.GetByIdAsync(2)).ReturnsAsync(team);
            var controller = new TeamController(mockRepo.Object, mockLogger.Object);
            var result = await controller.GetTeam(2);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var teamResult = Assert.IsType<Team>(okResult.Value);
            Assert.Equal(2, teamResult.TeamId);
        }

        [Fact]
        public async Task GetTeamById_ReturnsNotFound_WhenNoTeam()
        {
            var mockRepo = new Mock<ITeamRepository>();
            var mockLogger = new Mock<ILogger<TeamController>>();
            mockRepo.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((Team?)null);
            var controller = new TeamController(mockRepo.Object, mockLogger.Object);
            var result = await controller.GetTeam(99);
            Assert.IsType<NotFoundResult>(result.Result);
        }

        // Additional tests for Put, Post, Delete, and GetSeasonTeams can be added here following the same pattern.
    }
}
