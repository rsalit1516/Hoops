using System;
using System.IO;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Functions.Functions;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Moq;
using Xunit;

namespace Hoops.Functions.Tests
{
    public class PlayerFunctionsTest
    {
        private readonly Mock<IPlayerRepository> _mockRepository;
        private readonly Mock<IPlayerService> _mockPlayerService;
        private readonly PlayerFunctions _functions;
        private readonly Mock<FunctionContext> _mockContext;

        public PlayerFunctionsTest()
        {
            _mockRepository = new Mock<IPlayerRepository>();
            _mockPlayerService = new Mock<IPlayerService>();
            _functions = new PlayerFunctions(_mockRepository.Object, _mockPlayerService.Object);
            _mockContext = new Mock<FunctionContext>();
        }

        private HttpRequestData CreateMockRequest(string body = "")
        {
            var mockRequest = new Mock<HttpRequestData>(_mockContext.Object);
            var bodyBytes = Encoding.UTF8.GetBytes(body);
            var bodyStream = new MemoryStream(bodyBytes);

            mockRequest.Setup(r => r.Body).Returns(bodyStream);
            mockRequest.Setup(r => r.CreateResponse()).Returns(() =>
            {
                var mockResponse = new Mock<HttpResponseData>(_mockContext.Object);
                mockResponse.SetupProperty(r => r.StatusCode);
                mockResponse.SetupProperty(r => r.Headers, new HttpHeadersCollection());
                mockResponse.Setup(r => r.Body).Returns(new MemoryStream());
                return mockResponse.Object;
            });

            return mockRequest.Object;
        }

        [Fact]
        public async Task GetPlayer_WithValidId_ReturnsPlayer()
        {
            // Arrange
            var playerId = 1;
            var expectedPlayer = new Player
            {
                PlayerId = playerId,
                PersonId = 100,
                SeasonId = 1
            };

            _mockPlayerService.Setup(s => s.GetPlayerByIdAsync(playerId))
                .ReturnsAsync(expectedPlayer);

            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetPlayer(request, playerId);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task GetPlayer_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var playerId = 999;
            _mockPlayerService.Setup(s => s.GetPlayerByIdAsync(playerId))
                .ThrowsAsync(new InvalidOperationException());

            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetPlayer(request, playerId);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
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

            _mockRepository.Setup(r => r.GetPlayerByPersonAndSeasonId(personId, seasonId))
                .Returns(expectedPlayer);

            var request = CreateMockRequest();

            // Act
            var response = _functions.GetPlayerByPersonAndSeason(request, personId, seasonId);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public void GetPlayerByPersonAndSeason_WithNoPlayer_ReturnsNotFound()
        {
            // Arrange
            var personId = 999;
            var seasonId = 999;

            _mockRepository.Setup(r => r.GetPlayerByPersonAndSeasonId(personId, seasonId))
                .Returns((Player)null);

            var request = CreateMockRequest();

            // Act
            var response = _functions.GetPlayerByPersonAndSeason(request, personId, seasonId);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task PostPlayer_WithValidData_CreatesPlayer()
        {
            // Arrange
            var player = new Player
            {
                PlayerId = 0,
                PersonId = 100,
                SeasonId = 1,
                DivisionId = 5,
                CompanyId = 1
            };

            var playerJson = JsonSerializer.Serialize(player, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            var createdPlayer = new Player
            {
                PlayerId = 1,
                PersonId = 100,
                SeasonId = 1,
                DivisionId = 5,
                CompanyId = 1
            };

            _mockRepository.Setup(r => r.Insert(It.IsAny<Player>()))
                .Returns(createdPlayer);
            _mockRepository.Setup(r => r.SaveChangesAsync())
                .ReturnsAsync(1);

            var request = CreateMockRequest(playerJson);

            // Act
            var response = await _functions.PostPlayer(request);

            // Assert
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            _mockRepository.Verify(r => r.Insert(It.IsAny<Player>()), Times.Once);
            _mockRepository.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task PostPlayer_WithoutSeasonId_ReturnsBadRequest()
        {
            // Arrange
            var player = new Player
            {
                PlayerId = 0,
                PersonId = 100,
                SeasonId = null
            };

            var playerJson = JsonSerializer.Serialize(player, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            var request = CreateMockRequest(playerJson);

            // Act
            var response = await _functions.PostPlayer(request);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task PostPlayer_AutoDeterminesDivision_WhenNotProvided()
        {
            // Arrange
            var player = new Player
            {
                PlayerId = 0,
                PersonId = 100,
                SeasonId = 1,
                DivisionId = null
            };

            var playerJson = JsonSerializer.Serialize(player, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            _mockPlayerService.Setup(s => s.DetermineDivisionAsync(100, 1))
                .ReturnsAsync(5);

            var createdPlayer = new Player
            {
                PlayerId = 1,
                PersonId = 100,
                SeasonId = 1,
                DivisionId = 5
            };

            _mockRepository.Setup(r => r.Insert(It.IsAny<Player>()))
                .Returns(createdPlayer);
            _mockRepository.Setup(r => r.SaveChangesAsync())
                .ReturnsAsync(1);

            var request = CreateMockRequest(playerJson);

            // Act
            var response = await _functions.PostPlayer(request);

            // Assert
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            _mockPlayerService.Verify(s => s.DetermineDivisionAsync(100, 1), Times.Once);
        }

        [Fact]
        public async Task PutPlayer_WithValidData_UpdatesPlayer()
        {
            // Arrange
            var playerId = 1;
            var player = new Player
            {
                PlayerId = playerId,
                PersonId = 100,
                SeasonId = 1,
                DivisionId = 5
            };

            var playerJson = JsonSerializer.Serialize(player, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            _mockPlayerService.Setup(s => s.UpdatePlayerAsync(It.IsAny<Player>()))
                .ReturnsAsync(player);

            var request = CreateMockRequest(playerJson);

            // Act
            var response = await _functions.PutPlayer(request, playerId);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockPlayerService.Verify(s => s.UpdatePlayerAsync(It.IsAny<Player>()), Times.Once);
        }

        [Fact]
        public async Task PutPlayer_WithMismatchedId_ReturnsBadRequest()
        {
            // Arrange
            var playerId = 1;
            var player = new Player
            {
                PlayerId = 2,
                PersonId = 100
            };

            var playerJson = JsonSerializer.Serialize(player, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            var request = CreateMockRequest(playerJson);

            // Act
            var response = await _functions.PutPlayer(request, playerId);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task PutPlayer_WithNonExistentPlayer_ReturnsNotFound()
        {
            // Arrange
            var playerId = 999;
            var player = new Player
            {
                PlayerId = playerId,
                PersonId = 100
            };

            var playerJson = JsonSerializer.Serialize(player, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            _mockPlayerService.Setup(s => s.UpdatePlayerAsync(It.IsAny<Player>()))
                .ThrowsAsync(new InvalidOperationException());

            var request = CreateMockRequest(playerJson);

            // Act
            var response = await _functions.PutPlayer(request, playerId);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task DeletePlayer_WithValidId_DeletesPlayer()
        {
            // Arrange
            var playerId = 1;
            var player = new Player
            {
                PlayerId = playerId,
                PersonId = 100
            };

            _mockRepository.Setup(r => r.GetById(playerId))
                .Returns(player);
            _mockRepository.Setup(r => r.Delete(player));
            _mockRepository.Setup(r => r.SaveChangesAsync())
                .ReturnsAsync(1);

            var request = CreateMockRequest();

            // Act
            var response = await _functions.DeletePlayer(request, playerId);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.Delete(player), Times.Once);
        }

        [Fact]
        public async Task DeletePlayer_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var playerId = 999;

            _mockRepository.Setup(r => r.GetById(playerId))
                .Returns((Player)null);

            var request = CreateMockRequest();

            // Act
            var response = await _functions.DeletePlayer(request, playerId);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }
    }
}
