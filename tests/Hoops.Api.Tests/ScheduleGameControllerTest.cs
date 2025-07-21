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
    public class ScheduleGameControllerTest
    {
        [Fact]
        public async Task GetScheduleGame_ReturnsOkResult_WithGames()
        {
            var mockRepo = new Mock<IScheduleGameRepository>();
            var mockLogger = new Mock<ILogger<ScheduleGameController>>();
            var expectedGames = new List<ScheduleGame> { new ScheduleGame { ScheduleGamesId = 1 } };
            mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(expectedGames);
            var mockSeasonService = new Mock<Hoops.Application.Services.SeasonService>(null!);
            var controller = new ScheduleGameController(mockRepo.Object, mockLogger.Object, mockSeasonService.Object);
            var result = await controller.GetScheduleGame();
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var games = Assert.IsAssignableFrom<IEnumerable<ScheduleGame>>(okResult.Value);
            Assert.Single(games);
        }

        [Fact]
        public async Task GetScheduleGameById_ReturnsOkResult_WhenGameExists()
        {
            var mockRepo = new Mock<IScheduleGameRepository>();
            var mockLogger = new Mock<ILogger<ScheduleGameController>>();
            var game = new ScheduleGame { ScheduleGamesId = 2 };
            mockRepo.Setup(r => r.GetByIdAsync(2)).ReturnsAsync(game);
            var mockSeasonService = new Mock<Hoops.Application.Services.SeasonService>(null!);
            var controller = new ScheduleGameController(mockRepo.Object, mockLogger.Object, mockSeasonService.Object);
            var result = await controller.GetScheduleGame(2);
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var gameResult = Assert.IsType<ScheduleGame>(okResult.Value);
            Assert.Equal(2, gameResult.ScheduleGamesId);
        }

        [Fact]
        public async Task GetScheduleGameById_ReturnsNotFound_WhenNoGame()
        {
            var mockRepo = new Mock<IScheduleGameRepository>();
            var mockLogger = new Mock<ILogger<ScheduleGameController>>();
            mockRepo.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((ScheduleGame?)null);
            var mockSeasonService = new Mock<Hoops.Application.Services.SeasonService>(null!);
            var controller = new ScheduleGameController(mockRepo.Object, mockLogger.Object, mockSeasonService.Object);
            var result = await controller.GetScheduleGame(99);
            Assert.IsType<NotFoundResult>(result.Result);
        }

        // Additional tests for GetSeasonGames, GetStandings, Put, Post, and Delete can be added here following the same pattern.
    }
}
