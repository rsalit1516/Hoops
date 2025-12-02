using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using Hoops.Controllers;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Application.Services;

namespace Hoops.Api.Tests
{
    public class TeamControllerMappingTest
    {
        private readonly Mock<ITeamRepository> _mockTeamRepo;
        private readonly Mock<ILogger<TeamController>> _mockLogger;
        private readonly Mock<ISeasonService> _mockSeasonService;
        private readonly Mock<IScheduleDivTeamsRepository> _mockScheduleDivTeamsRepo;
        private readonly TeamController _controller;

        public TeamControllerMappingTest()
        {
            _mockTeamRepo = new Mock<ITeamRepository>();
            _mockLogger = new Mock<ILogger<TeamController>>();
            _mockSeasonService = new Mock<ISeasonService>();
            _mockScheduleDivTeamsRepo = new Mock<IScheduleDivTeamsRepository>();

            _controller = new TeamController(
                _mockTeamRepo.Object,
                _mockLogger.Object,
                _mockSeasonService.Object,
                _mockScheduleDivTeamsRepo.Object);
        }

        [Fact]
        public void GetMappedTeamNumber_WithValidParameters_ReturnsTeamNumber()
        {
            // Arrange
            int scheduleNumber = 74;
            int teamNumber = 17;
            int expectedTeamNumber = 131;

            _mockScheduleDivTeamsRepo
                .Setup(repo => repo.GetTeamNo(scheduleNumber, teamNumber))
                .Returns(expectedTeamNumber);

            // Act
            var result = _controller.GetMappedTeamNumber(scheduleNumber, teamNumber);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(expectedTeamNumber, okResult.Value);
        }

        [Fact]
        public void GetMappedTeamNumberWithSeason_WithValidParameters_ReturnsTeamNumber()
        {
            // Arrange
            int scheduleNumber = 74;
            int teamNumber = 17;
            int seasonId = 2204;
            int expectedTeamNumber = 131;

            _mockScheduleDivTeamsRepo
                .Setup(repo => repo.GetTeamNo(scheduleNumber, teamNumber, seasonId))
                .Returns(expectedTeamNumber);

            // Act
            var result = _controller.GetMappedTeamNumber(scheduleNumber, teamNumber, seasonId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(expectedTeamNumber, okResult.Value);
        }

        [Fact]
        public void GetMappedTeamNumber_WithInvalidParameters_ReturnsBadRequest()
        {
            // Act & Assert
            var result1 = _controller.GetMappedTeamNumber(0, 1);
            Assert.IsType<BadRequestObjectResult>(result1.Result);

            var result2 = _controller.GetMappedTeamNumber(1, 0);
            Assert.IsType<BadRequestObjectResult>(result2.Result);

            var result3 = _controller.GetMappedTeamNumber(-1, 1);
            Assert.IsType<BadRequestObjectResult>(result3.Result);
        }

        [Fact]
        public void GetMappedTeamNumberWithSeason_WithInvalidParameters_ReturnsBadRequest()
        {
            // Act & Assert
            var result1 = _controller.GetMappedTeamNumber(0, 1, 1);
            Assert.IsType<BadRequestObjectResult>(result1.Result);

            var result2 = _controller.GetMappedTeamNumber(1, 0, 1);
            Assert.IsType<BadRequestObjectResult>(result2.Result);

            var result3 = _controller.GetMappedTeamNumber(1, 1, 0);
            Assert.IsType<BadRequestObjectResult>(result3.Result);

            var result4 = _controller.GetMappedTeamNumber(-1, 1, 1);
            Assert.IsType<BadRequestObjectResult>(result4.Result);
        }
    }
}
