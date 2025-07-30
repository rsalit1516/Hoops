using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using Hoops.Controllers;
using Microsoft.Extensions.Logging;
using System.Linq;
using static Hoops.Core.Enum.GroupTypes;

namespace Hoops.Api.Tests
{
    public class ScheduleGameControllerTest
    {
        private readonly Mock<IScheduleGameRepository> _mockRepo;
        private readonly Mock<ILogger<ScheduleGameController>> _mockLogger;
        private readonly Mock<Hoops.Application.Services.SeasonService> _mockSeasonService;
        private readonly ScheduleGameController _controller;

        public ScheduleGameControllerTest()
        {
            _mockRepo = new Mock<IScheduleGameRepository>();
            _mockLogger = new Mock<ILogger<ScheduleGameController>>();
            _mockSeasonService = new Mock<Hoops.Application.Services.SeasonService>(null!);
            _controller = new ScheduleGameController(_mockRepo.Object, _mockLogger.Object, _mockSeasonService.Object);
        }

        [Fact]
        public async Task GetScheduleGame_ReturnsOkResult_WithGames()
        {
            // Arrange
            var expectedGames = new List<ScheduleGame> { new ScheduleGame { ScheduleGamesId = 1 } };
            _mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(expectedGames);

            // Act
            var result = await _controller.GetScheduleGame();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var games = Assert.IsAssignableFrom<IEnumerable<ScheduleGame>>(okResult.Value);
            Assert.Single(games);
        }

        [Fact]
        public async Task GetScheduleGameById_ReturnsOkResult_WhenGameExists()
        {
            // Arrange
            var game = new ScheduleGame { ScheduleGamesId = 2 };
            _mockRepo.Setup(r => r.GetByIdAsync(2)).ReturnsAsync(game);

            // Act
            var result = await _controller.GetScheduleGame(2);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var gameResult = Assert.IsType<ScheduleGame>(okResult.Value);
            Assert.Equal(2, gameResult.ScheduleGamesId);
        }

        [Fact]
        public async Task GetScheduleGameById_ReturnsNotFound_WhenNoGame()
        {
            // Arrange
            _mockRepo.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((ScheduleGame?)null);

            // Act
            var result = await _controller.GetScheduleGame(99);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public void GetSeasonGames_ReturnsOkResult_WithVmGameScheduleList()
        {
            // Arrange
            var expectedGames = new List<vmGameSchedule>
            {
                new vmGameSchedule 
                { 
                    ScheduleGamesId = 1, 
                    SeasonId = 3055,
                    HomeTeamName = "Red Team",
                    VisitingTeamName = "Blue Team",
                    LocationName = "Gym A",
                    GameType = GameTypes.Regular
                },
                new vmGameSchedule 
                { 
                    ScheduleGamesId = 2, 
                    SeasonId = 3055,
                    HomeTeamName = "Green Team",
                    VisitingTeamName = "Yellow Team",
                    LocationName = "Gym B",
                    GameType = GameTypes.Regular
                }
            };
            _mockRepo.Setup(r => r.GetGames(3055)).Returns(expectedGames);

            // Act
            var result = _controller.GetSeasonGames(3055);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var games = Assert.IsAssignableFrom<IEnumerable<vmGameSchedule>>(okResult.Value);
            Assert.Equal(2, games.Count());
            
            var firstGame = games.First();
            Assert.Equal("Red Team", firstGame.HomeTeamName);
            Assert.Equal("Blue Team", firstGame.VisitingTeamName);
            Assert.Equal("Gym A", firstGame.LocationName);
        }

        [Fact]
        public void GetSeasonGames_ReturnsBadRequest_WhenSeasonIdIsZeroOrNegative()
        {
            // Act & Assert
            var result1 = _controller.GetSeasonGames(0);
            var result2 = _controller.GetSeasonGames(-1);

            Assert.IsType<BadRequestObjectResult>(result1);
            Assert.IsType<BadRequestObjectResult>(result2);
        }

        [Fact]
        public void GetSeasonGames_ReturnsInternalServerError_WhenExceptionThrown()
        {
            // Arrange
            _mockRepo.Setup(r => r.GetGames(It.IsAny<int>())).Throws(new System.Exception("Database error"));

            // Act
            var result = _controller.GetSeasonGames(3055);

            // Assert
            var statusResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, statusResult.StatusCode);
        }

        [Fact]
        public void GetStandings_ReturnsOkResult_WithStandings()
        {
            // Arrange
            var expectedStandings = new List<ScheduleStandingsVM>
            {
                new ScheduleStandingsVM { TeamName = "Red Team", Won = 5, Lost = 2, Pct = 71.4m },
                new ScheduleStandingsVM { TeamName = "Blue Team", Won = 3, Lost = 4, Pct = 42.9m }
            };
            _mockRepo.Setup(r => r.GetStandings(3055, 3163)).Returns(expectedStandings);

            // Act
            var result = _controller.GetStandings(3055, 3163);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var standings = Assert.IsAssignableFrom<IEnumerable<ScheduleStandingsVM>>(okResult.Value);
            Assert.Equal(2, standings.Count());
            
            var firstTeam = standings.First();
            Assert.Equal("Red Team", firstTeam.TeamName);
            Assert.Equal(5, firstTeam.Won);
            Assert.Equal(2, firstTeam.Lost);
        }

        [Fact]
        public void GetStandings_ReturnsBadRequest_WhenSeasonIdIsInvalid()
        {
            // Act & Assert
            var result1 = _controller.GetStandings(0, 3163);
            var result2 = _controller.GetStandings(-1, 3163);

            Assert.IsType<BadRequestObjectResult>(result1);
            Assert.IsType<BadRequestObjectResult>(result2);
        }

        [Fact]
        public void GetStandings_ReturnsBadRequest_WhenDivisionIdIsInvalid()
        {
            // Act & Assert
            var result1 = _controller.GetStandings(3055, 0);
            var result2 = _controller.GetStandings(3055, -1);

            Assert.IsType<BadRequestObjectResult>(result1);
            Assert.IsType<BadRequestObjectResult>(result2);
        }

        [Fact]
        public void GetStandings_ReturnsEmptyList_WhenNoStandingsFound()
        {
            // Arrange
            _mockRepo.Setup(r => r.GetStandings(3055, 3163)).Returns(new List<ScheduleStandingsVM>());

            // Act
            var result = _controller.GetStandings(3055, 3163);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var standings = Assert.IsAssignableFrom<IEnumerable<ScheduleStandingsVM>>(okResult.Value);
            Assert.Empty(standings);
        }

        [Fact]
        public async Task PostScheduleGame_ReturnsCreatedAtAction_WithValidGame()
        {
            // Arrange
            var newGame = new ScheduleGame 
            { 
                ScheduleGamesId = 0, 
                SeasonId = 3055, 
                DivisionId = 3163,
                GameDate = new System.DateTime(2024, 6, 15),
                HomeTeamNumber = 1,
                VisitingTeamNumber = 2
            };
            var savedGame = new ScheduleGame { ScheduleGamesId = 123, SeasonId = 3055 };
            
            _mockRepo.Setup(r => r.Add(It.IsAny<ScheduleGame>()));
            _mockRepo.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.PostScheduleGame(newGame);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal("GetScheduleGame", createdResult.ActionName);
            _mockRepo.Verify(r => r.Add(It.IsAny<ScheduleGame>()), Times.Once);
        }

        [Fact]
        public async Task PutScheduleGame_ReturnsNoContent_WhenUpdateSuccessful()
        {
            // Arrange
            var gameToUpdate = new ScheduleGame { ScheduleGamesId = 1, SeasonId = 3055 };
            _mockRepo.Setup(r => r.Update(It.IsAny<ScheduleGame>()));
            _mockRepo.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.PutScheduleGame(1, gameToUpdate);

            // Assert
            Assert.IsType<NoContentResult>(result);
            _mockRepo.Verify(r => r.Update(It.IsAny<ScheduleGame>()), Times.Once);
        }

        [Fact]
        public async Task PutScheduleGame_ReturnsBadRequest_WhenIdMismatch()
        {
            // Arrange
            var gameToUpdate = new ScheduleGame { ScheduleGamesId = 2, SeasonId = 3055 };

            // Act
            var result = await _controller.PutScheduleGame(1, gameToUpdate);

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task DeleteScheduleGame_ReturnsOkResult_WhenGameExists()
        {
            // Arrange
            var gameToDelete = new ScheduleGame { ScheduleGamesId = 1, SeasonId = 3055 };
            _mockRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(gameToDelete);
            _mockRepo.Setup(r => r.Delete(It.IsAny<ScheduleGame>()));
            _mockRepo.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.DeleteScheduleGame(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var deletedGame = Assert.IsType<ScheduleGame>(okResult.Value);
            Assert.Equal(1, deletedGame.ScheduleGamesId);
            _mockRepo.Verify(r => r.Delete(It.IsAny<ScheduleGame>()), Times.Once);
        }

        [Fact]
        public async Task DeleteScheduleGame_ReturnsNotFound_WhenGameDoesNotExist()
        {
            // Arrange
            _mockRepo.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((ScheduleGame?)null);

            // Act
            var result = await _controller.DeleteScheduleGame(99);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }
    }
}
