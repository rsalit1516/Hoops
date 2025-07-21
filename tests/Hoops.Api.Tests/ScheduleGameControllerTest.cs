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
            var controller = new ScheduleGameController(null, mockRepo.Object, mockLogger.Object);
            var result = await controller.GetScheduleGame();
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var games = Assert.IsAssignableFrom<IEnumerable<ScheduleGame>>(okResult.Value);
            Assert.Single(games);
        }

        [Fact]
        public async Task GetScheduleGameById_ReturnsOkResult_WhenGameExists()
        {
            var mockContext = new Mock<Hoops.Infrastructure.Data.hoopsContext>();
            var mockRepo = new Mock<IScheduleGameRepository>();
            var mockLogger = new Mock<ILogger<ScheduleGameController>>();
            var game = new ScheduleGame { ScheduleGamesId = 2 };
            mockContext.Setup(c => c.ScheduleGames.FindAsync(2)).ReturnsAsync(game);
            var controller = new ScheduleGameController(mockContext.Object, mockRepo.Object, mockLogger.Object);
            var result = await controller.GetScheduleGame(2);
            var okResult = Assert.IsType<ActionResult<ScheduleGame>>(result);
            Assert.NotNull(okResult.Value);
            Assert.Equal(2, okResult.Value!.ScheduleGamesId);
        }

        [Fact]
        public async Task GetScheduleGameById_ReturnsNotFound_WhenNoGame()
        {
            var mockContext = new Mock<Hoops.Infrastructure.Data.hoopsContext>();
            var mockRepo = new Mock<IScheduleGameRepository>();
            var mockLogger = new Mock<ILogger<ScheduleGameController>>();
            mockContext.Setup(c => c.ScheduleGames.FindAsync(99)).ReturnsAsync((ScheduleGame?)null);
            var controller = new ScheduleGameController(mockContext.Object, mockRepo.Object, mockLogger.Object);
            var result = await controller.GetScheduleGame(99);
            Assert.IsType<NotFoundResult>(result.Result);
        }

        // Additional tests for GetSeasonGames, GetStandings, Put, Post, and Delete can be added here following the same pattern.
    }
}
