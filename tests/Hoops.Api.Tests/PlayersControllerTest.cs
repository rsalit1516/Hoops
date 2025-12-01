using Hoops.Controllers;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System.Threading.Tasks;
using Xunit;

namespace Hoops.Api.Tests
{
    public class PlayersControllerTest
    {
        private readonly Mock<IPlayerRepository> _mockPlayerRepository;
        private readonly Mock<IPlayerService> _mockPlayerService;
        private readonly Mock<ILogger<PlayersController>> _mockLogger;
        private readonly PlayersController _controller;

        public PlayersControllerTest()
        {
            _mockPlayerRepository = new Mock<IPlayerRepository>();
            _mockPlayerService = new Mock<IPlayerService>();
            _mockLogger = new Mock<ILogger<PlayersController>>();
            _controller = new PlayersController(
                _mockPlayerRepository.Object,
                _mockPlayerService.Object,
                _mockLogger.Object);
        }

        [Fact]
        public async Task GetPlayer_WithValidId_ReturnsPlayer()
        {
            // Arrange
            var playerId = 1;
            var expectedPlayer = new Player { PlayerId = playerId, PersonId = 100 };
            _mockPlayerService.Setup(s => s.GetPlayerByIdAsync(playerId))
                .ReturnsAsync(expectedPlayer);

            // Act
            var result = await _controller.GetPlayer(playerId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var player = Assert.IsType<Player>(okResult.Value);
            Assert.Equal(playerId, player.PlayerId);
        }

        [Fact]
        public async Task GetPlayer_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var playerId = 999;
            _mockPlayerService.Setup(s => s.GetPlayerByIdAsync(playerId))
                .ThrowsAsync(new System.InvalidOperationException());

            // Act
            var result = await _controller.GetPlayer(playerId);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task CreatePlayer_WithValidData_ReturnsCreatedPlayer()
        {
            // Arrange
            var player = new Player
            {
                PersonId = 100,
                SeasonId = 1,
                CompanyId = 1,
                DivisionId = null
            };
            var createdPlayer = new Player
            {
                PlayerId = 1,
                PersonId = 100,
                SeasonId = 1,
                CompanyId = 1,
                DivisionId = 5
            };

            _mockPlayerService.Setup(s => s.DetermineDivisionAsync(100, 1))
                .ReturnsAsync(5);
            _mockPlayerRepository.Setup(r => r.Insert(It.IsAny<Player>()))
                .Returns(createdPlayer);
            _mockPlayerRepository.Setup(r => r.SaveChanges());

            // Act
            var result = await _controller.CreatePlayer(player);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnedPlayer = Assert.IsType<Player>(createdResult.Value);
            Assert.Equal(1, returnedPlayer.PlayerId);
            Assert.Equal(5, returnedPlayer.DivisionId);
        }

        [Fact]
        public async Task CreatePlayer_WithoutSeasonId_ReturnsBadRequest()
        {
            // Arrange
            var player = new Player
            {
                PersonId = 100,
                SeasonId = null
            };

            // Act
            var result = await _controller.CreatePlayer(player);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async Task UpdatePlayer_WithValidData_ReturnsUpdatedPlayer()
        {
            // Arrange
            var playerId = 1;
            var player = new Player
            {
                PlayerId = playerId,
                PersonId = 100,
                SeasonId = 1
            };

            _mockPlayerService.Setup(s => s.UpdatePlayerAsync(player))
                .ReturnsAsync(player);

            // Act
            var result = await _controller.UpdatePlayer(playerId, player);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var updatedPlayer = Assert.IsType<Player>(okResult.Value);
            Assert.Equal(playerId, updatedPlayer.PlayerId);
        }

        [Fact]
        public async Task UpdatePlayer_WithMismatchedId_ReturnsBadRequest()
        {
            // Arrange
            var playerId = 1;
            var player = new Player
            {
                PlayerId = 2,
                PersonId = 100
            };

            // Act
            var result = await _controller.UpdatePlayer(playerId, player);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public void DeletePlayer_WithValidId_ReturnsDeletedPlayer()
        {
            // Arrange
            var playerId = 1;
            var player = new Player { PlayerId = playerId, PersonId = 100 };
            _mockPlayerRepository.Setup(r => r.GetById(playerId))
                .Returns(player);
            _mockPlayerRepository.Setup(r => r.Delete(player));
            _mockPlayerRepository.Setup(r => r.SaveChanges());

            // Act
            var result = _controller.DeletePlayer(playerId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var deletedPlayer = Assert.IsType<Player>(okResult.Value);
            Assert.Equal(playerId, deletedPlayer.PlayerId);
        }

        [Fact]
        public void DeletePlayer_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var playerId = 999;
            _mockPlayerRepository.Setup(r => r.GetById(playerId))
                .Returns((Player)null);

            // Act
            var result = _controller.DeletePlayer(playerId);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public void GetPlayerByPersonId_WithValidId_ReturnsPlayer()
        {
            // Arrange
            var personId = 100;
            var player = new Player { PlayerId = 1, PersonId = personId };
            _mockPlayerRepository.Setup(r => r.GetByPersonId(personId))
                .Returns(player);

            // Act
            var result = _controller.GetPlayerByPersonId(personId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedPlayer = Assert.IsType<Player>(okResult.Value);
            Assert.Equal(personId, returnedPlayer.PersonId);
        }

        [Fact]
        public void GetPlayerByPersonAndSeason_WithValidIds_ReturnsPlayer()
        {
            // Arrange
            var personId = 100;
            var seasonId = 1;
            var player = new Player { PlayerId = 1, PersonId = personId, SeasonId = seasonId };
            _mockPlayerRepository.Setup(r => r.GetPlayerByPersonAndSeasonId(personId, seasonId))
                .Returns(player);

            // Act
            var result = _controller.GetPlayerByPersonAndSeason(personId, seasonId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedPlayer = Assert.IsType<Player>(okResult.Value);
            Assert.Equal(personId, returnedPlayer.PersonId);
            Assert.Equal(seasonId, returnedPlayer.SeasonId);
        }
    }
}
