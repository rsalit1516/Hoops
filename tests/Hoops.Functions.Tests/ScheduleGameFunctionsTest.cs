using System.Collections.Generic;
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
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Hoops.Functions.Tests
{
    public class ScheduleGameFunctionsTest
    {
        private readonly Mock<IScheduleGameRepository> _mockRepository;
        private readonly Mock<ILogger<ScheduleGameFunctions>> _mockLogger;
        private readonly ScheduleGameFunctions _functions;
        private readonly Mock<FunctionContext> _mockContext;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public ScheduleGameFunctionsTest()
        {
            _mockRepository = new Mock<IScheduleGameRepository>();
            _mockLogger = new Mock<ILogger<ScheduleGameFunctions>>();
            _functions = new ScheduleGameFunctions(_mockRepository.Object, _mockLogger.Object);
            _mockContext = new Mock<FunctionContext>();

            // Default: unauthenticated
            _mockContext.Setup(c => c.Items).Returns(new Dictionary<object, object>());

            var mockFunctionDef = new Mock<FunctionDefinition>();
            mockFunctionDef.Setup(f => f.Name).Returns("TestFunction");
            _mockContext.Setup(c => c.FunctionDefinition).Returns(mockFunctionDef.Object);
        }

        private HttpRequestData CreateMockRequest(string body = "", string url = "http://localhost/api/ScheduleGame")
        {
            var mockRequest = new Mock<HttpRequestData>(_mockContext.Object);
            var bodyStream = new MemoryStream(Encoding.UTF8.GetBytes(body));

            mockRequest.Setup(r => r.Body).Returns(bodyStream);
            mockRequest.Setup(r => r.Url).Returns(new System.Uri(url));
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

        private void SetAuthenticated()
        {
            var items = new Dictionary<object, object> { ["User"] = new { UserId = 1 } };
            _mockContext.Setup(c => c.Items).Returns(items);
        }

        // ── GetSeasonGames ──────────────────────────────────────────────────────

        [Fact]
        public async Task GetSeasonGames_WithoutSeasonId_ReturnsBadRequest()
        {
            // Arrange
            var request = CreateMockRequest(url: "http://localhost/api/ScheduleGame/GetSeasonGames");

            // Act
            var response = await _functions.GetSeasonGames(request);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task GetSeasonGames_WithValidSeasonId_ReturnsOk()
        {
            // Arrange
            _mockRepository.Setup(r => r.GetGames(5)).Returns(new List<Hoops.Core.ViewModels.vmGameSchedule>());
            var request = CreateMockRequest(url: "http://localhost/api/ScheduleGame/GetSeasonGames?seasonId=5");

            // Act
            var response = await _functions.GetSeasonGames(request);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.GetGames(5), Times.Once);
        }

        // ── GetStandings ────────────────────────────────────────────────────────

        [Fact]
        public async Task GetStandings_WithInvalidIds_ReturnsBadRequest()
        {
            // Arrange
            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetStandings(request, 0, 1);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task GetStandings_WithValidIds_ReturnsOk()
        {
            // Arrange
            _mockRepository.Setup(r => r.GetStandings(1, 2)).Returns(new List<Hoops.Core.ViewModels.ScheduleStandingsVM>());
            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetStandings(request, 1, 2);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        // ── PostScheduleGame ─────────────────────────────────────────────────────

        [Fact]
        public async Task PostScheduleGame_WhenUnauthenticated_ReturnsUnauthorized()
        {
            // Arrange
            var game = new ScheduleGame { ScheduleGamesId = 0, SeasonId = 1 };
            var request = CreateMockRequest(JsonSerializer.Serialize(game, JsonOptions));

            // Act
            var response = await _functions.PostScheduleGame(request, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task PostScheduleGame_WithNullBody_ReturnsBadRequest()
        {
            // Arrange
            SetAuthenticated();
            var request = CreateMockRequest("null");

            // Act
            var response = await _functions.PostScheduleGame(request, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task PostScheduleGame_WithValidBody_ReturnsCreated()
        {
            // Arrange
            SetAuthenticated();
            var game = new ScheduleGame { ScheduleGamesId = 0, SeasonId = 1 };
            _mockRepository.Setup(r => r.Insert(It.IsAny<ScheduleGame>())).Returns(game);
            _mockRepository.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var request = CreateMockRequest(JsonSerializer.Serialize(game, JsonOptions));

            // Act
            var response = await _functions.PostScheduleGame(request, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            _mockRepository.Verify(r => r.Insert(It.IsAny<ScheduleGame>()), Times.Once);
            _mockRepository.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        // ── PutScheduleGame ──────────────────────────────────────────────────────

        [Fact]
        public async Task PutScheduleGame_WhenUnauthenticated_ReturnsUnauthorized()
        {
            // Arrange
            var game = new ScheduleGame { ScheduleGamesId = 1, SeasonId = 1 };
            var request = CreateMockRequest(JsonSerializer.Serialize(game, JsonOptions));

            // Act
            var response = await _functions.PutScheduleGame(request, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task PutScheduleGame_WithMismatchedId_ReturnsBadRequest()
        {
            // Arrange
            SetAuthenticated();
            var game = new ScheduleGame { ScheduleGamesId = 2, SeasonId = 1 };
            var request = CreateMockRequest(JsonSerializer.Serialize(game, JsonOptions));

            // Act
            var response = await _functions.PutScheduleGame(request, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task PutScheduleGame_WithScoreOutOfRange_ReturnsBadRequest()
        {
            // Arrange
            SetAuthenticated();
            var game = new ScheduleGame { ScheduleGamesId = 1, SeasonId = 1, HomeTeamScore = 200 };
            var request = CreateMockRequest(JsonSerializer.Serialize(game, JsonOptions));

            // Act
            var response = await _functions.PutScheduleGame(request, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task PutScheduleGame_WithNonExistentGame_ReturnsNotFound()
        {
            // Arrange
            SetAuthenticated();
            var game = new ScheduleGame { ScheduleGamesId = 999, SeasonId = 1, HomeTeamScore = 50 };
            _mockRepository.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((ScheduleGame)null!);

            var request = CreateMockRequest(JsonSerializer.Serialize(game, JsonOptions));

            // Act
            var response = await _functions.PutScheduleGame(request, 999, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task PutScheduleGame_WithValidData_ReturnsNoContent()
        {
            // Arrange
            SetAuthenticated();
            var existing = new ScheduleGame { ScheduleGamesId = 1, SeasonId = 1 };
            var body = new ScheduleGame { ScheduleGamesId = 1, SeasonId = 1, HomeTeamScore = 45, VisitingTeamScore = 38 };
            _mockRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(existing);
            _mockRepository.Setup(r => r.Update(It.IsAny<ScheduleGame>())).Returns(existing);
            _mockRepository.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var request = CreateMockRequest(JsonSerializer.Serialize(body, JsonOptions));

            // Act
            var response = await _functions.PutScheduleGame(request, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        }

        // ── PutScheduleGameScores ────────────────────────────────────────────────

        [Fact]
        public async Task PutScheduleGameScores_WhenUnauthenticated_ReturnsUnauthorized()
        {
            // Arrange
            var dto = new Hoops.Functions.Models.UpdateGameScoresDto { ScheduleGamesId = 1 };
            var request = CreateMockRequest(JsonSerializer.Serialize(dto, JsonOptions));

            // Act
            var response = await _functions.PutScheduleGameScores(request, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task PutScheduleGameScores_WithValidData_ReturnsNoContent()
        {
            // Arrange
            SetAuthenticated();
            var existing = new ScheduleGame { ScheduleGamesId = 1, SeasonId = 1 };
            var dto = new Hoops.Functions.Models.UpdateGameScoresDto
            {
                ScheduleGamesId = 1,
                HomeTeamScore = 60,
                VisitingTeamScore = 55
            };
            _mockRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(existing);
            _mockRepository.Setup(r => r.Update(It.IsAny<ScheduleGame>())).Returns(existing);
            _mockRepository.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var request = CreateMockRequest(JsonSerializer.Serialize(dto, JsonOptions));

            // Act
            var response = await _functions.PutScheduleGameScores(request, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        }

        // ── DeleteScheduleGame ───────────────────────────────────────────────────

        [Fact]
        public async Task DeleteScheduleGame_WhenUnauthenticated_ReturnsUnauthorized()
        {
            // Arrange
            var request = CreateMockRequest();

            // Act
            var response = await _functions.DeleteScheduleGame(request, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task DeleteScheduleGame_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            SetAuthenticated();
            _mockRepository.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((ScheduleGame)null!);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.DeleteScheduleGame(request, 999, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task DeleteScheduleGame_WithValidId_ReturnsNoContent()
        {
            // Arrange
            SetAuthenticated();
            var game = new ScheduleGame { ScheduleGamesId = 1 };
            _mockRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(game);
            _mockRepository.Setup(r => r.Delete(game));
            _mockRepository.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.DeleteScheduleGame(request, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
            _mockRepository.Verify(r => r.Delete(game), Times.Once);
        }
    }
}
