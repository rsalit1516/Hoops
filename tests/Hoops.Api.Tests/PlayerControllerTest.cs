using Hoops.Core.Interface;
using Hoops.Core.Models;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Linq;
using Xunit;
using csbc_server.Controllers;

namespace Hoops.Api.Tests
{
    public class PlayerControllerTest
    {
        private readonly Mock<IPlayerRepository> _mockPlayerRepository;
        private readonly PlayerController _controller;

        public PlayerControllerTest()
        {
            _mockPlayerRepository = new Mock<IPlayerRepository>();
            _controller = new PlayerController(_mockPlayerRepository.Object);
        }

        [Fact]
        public void GetPlayersBySeason_WithValidSeasonId_ReturnsPlayers()
        {
            // Arrange
            var seasonId = 1;
            var expectedPlayers = new List<DraftListPlayer>
            {
                new DraftListPlayer
                {
                    PersonId = 1,
                    Division = "HS Boys",
                    DraftId = "001",
                    LastName = "Smith",
                    FirstName = "John"
                },
                new DraftListPlayer
                {
                    PersonId = 2,
                    Division = "HS Boys",
                    DraftId = "002",
                    LastName = "Johnson",
                    FirstName = "Mike"
                }
            };

            _mockPlayerRepository.Setup(r => r.GetDraftListPlayers(seasonId, null))
                .Returns(expectedPlayers);

            // Act
            var result = _controller.GetPlayersBySeason(seasonId, null);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var players = Assert.IsAssignableFrom<List<DraftListPlayer>>(okResult.Value);
            Assert.Equal(2, players.Count);
            Assert.Equal("Smith", players[0].LastName);
        }

        [Fact]
        public void GetPlayersBySeason_WithSeasonIdAndDivisionId_ReturnsFilteredPlayers()
        {
            // Arrange
            var seasonId = 1;
            var divisionId = 5;
            var expectedPlayers = new List<DraftListPlayer>
            {
                new DraftListPlayer
                {
                    PersonId = 1,
                    Division = "HS Boys",
                    DraftId = "001",
                    LastName = "Smith",
                    FirstName = "John"
                }
            };

            _mockPlayerRepository.Setup(r => r.GetDraftListPlayers(seasonId, divisionId))
                .Returns(expectedPlayers);

            // Act
            var result = _controller.GetPlayersBySeason(seasonId, divisionId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var players = Assert.IsAssignableFrom<List<DraftListPlayer>>(okResult.Value);
            Assert.Single(players);
            Assert.Equal("HS Boys", players[0].Division);
        }

        [Fact]
        public void GetPlayersBySeason_WithNoPlayers_ReturnsEmptyList()
        {
            // Arrange
            var seasonId = 999;
            var expectedPlayers = new List<DraftListPlayer>();

            _mockPlayerRepository.Setup(r => r.GetDraftListPlayers(seasonId, null))
                .Returns(expectedPlayers);

            // Act
            var result = _controller.GetPlayersBySeason(seasonId, null);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var players = Assert.IsAssignableFrom<List<DraftListPlayer>>(okResult.Value);
            Assert.Empty(players);
        }

        [Fact]
        public void GetPlayer_WithValidId_ReturnsPlayer()
        {
            // Arrange
            var playerId = 1;
            var expectedPlayer = new Player
            {
                PlayerId = playerId,
                PersonId = 100,
                SeasonId = 1,
                DivisionId = 5
            };

            _mockPlayerRepository.Setup(r => r.GetById(playerId))
                .Returns(expectedPlayer);

            // Act
            var result = _controller.GetPlayer(playerId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var player = Assert.IsType<Player>(okResult.Value);
            Assert.Equal(playerId, player.PlayerId);
            Assert.Equal(100, player.PersonId);
        }

        [Fact]
        public void GetPlayer_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var playerId = 999;
            _mockPlayerRepository.Setup(r => r.GetById(playerId))
                .Returns((Player)null);

            // Act
            var result = _controller.GetPlayer(playerId);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public void GetPlayerByPersonAndSeason_WithValidIds_ReturnsPlayer()
        {
            // Arrange
            var personId = 100;
            var seasonId = 1;
            var expectedPlayer = new Player
            {
                PlayerId = 1,
                PersonId = personId,
                SeasonId = seasonId
            };

            _mockPlayerRepository.Setup(r => r.GetPlayerByPersonAndSeasonId(personId, seasonId))
                .Returns(expectedPlayer);

            // Act
            var result = _controller.GetPlayerByPersonAndSeason(personId, seasonId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var player = Assert.IsType<Player>(okResult.Value);
            Assert.Equal(personId, player.PersonId);
            Assert.Equal(seasonId, player.SeasonId);
        }

        [Fact]
        public void GetPlayerByPersonAndSeason_WithInvalidIds_ReturnsNotFound()
        {
            // Arrange
            var personId = 999;
            var seasonId = 999;
            _mockPlayerRepository.Setup(r => r.GetPlayerByPersonAndSeasonId(personId, seasonId))
                .Returns((Player)null);

            // Act
            var result = _controller.GetPlayerByPersonAndSeason(personId, seasonId);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public void GetPlayerByPersonAndSeason_WithZeroPlayerId_ReturnsNotFound()
        {
            // Arrange
            var personId = 100;
            var seasonId = 1;
            var emptyPlayer = new Player { PlayerId = 0 };

            _mockPlayerRepository.Setup(r => r.GetPlayerByPersonAndSeasonId(personId, seasonId))
                .Returns(emptyPlayer);

            // Act
            var result = _controller.GetPlayerByPersonAndSeason(personId, seasonId);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }
    }
}
