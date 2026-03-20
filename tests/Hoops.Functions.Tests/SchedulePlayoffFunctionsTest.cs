using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;
using Hoops.Functions.Functions;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Hoops.Functions.Tests
{
    public class SchedulePlayoffFunctionsTest
    {
        private readonly Mock<ISchedulePlayoffRepository> _mockRepository;
        private readonly Mock<ILogger<SchedulePlayoffFunctions>> _mockLogger;
        private readonly SchedulePlayoffFunctions _functions;
        private readonly Mock<FunctionContext> _mockContext;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public SchedulePlayoffFunctionsTest()
        {
            _mockRepository = new Mock<ISchedulePlayoffRepository>();
            _mockLogger = new Mock<ILogger<SchedulePlayoffFunctions>>();
            _functions = new SchedulePlayoffFunctions(_mockRepository.Object, _mockLogger.Object);
            _mockContext = new Mock<FunctionContext>();

            // Default: unauthenticated
            _mockContext.Setup(c => c.Items).Returns(new Dictionary<object, object>());

            var mockFunctionDef = new Mock<FunctionDefinition>();
            mockFunctionDef.Setup(f => f.Name).Returns("TestFunction");
            _mockContext.Setup(c => c.FunctionDefinition).Returns(mockFunctionDef.Object);
        }

        private HttpRequestData CreateMockRequest(string body = "", string url = "http://localhost/api/SchedulePlayoff")
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

        // ── GetSeasonPlayoffGames ────────────────────────────────────────────────

        [Fact]
        public async Task GetSeasonPlayoffGames_WithoutSeasonId_ReturnsBadRequest()
        {
            // Arrange
            var request = CreateMockRequest(url: "http://localhost/api/SchedulePlayoff/GetSeasonPlayoffGames");

            // Act
            var response = await _functions.GetSeasonPlayoffGames(request);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task GetSeasonPlayoffGames_WithValidSeasonId_ReturnsOk()
        {
            // Arrange
            _mockRepository.Setup(r => r.GetGamesBySeasonId(3)).Returns(new List<PlayoffGameVm>().AsQueryable());
            var request = CreateMockRequest(url: "http://localhost/api/SchedulePlayoff/GetSeasonPlayoffGames?seasonId=3");

            // Act
            var response = await _functions.GetSeasonPlayoffGames(request);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.GetGamesBySeasonId(3), Times.Once);
        }

        // ── PostSchedulePlayoff ──────────────────────────────────────────────────

        [Fact]
        public async Task PostSchedulePlayoff_WhenUnauthenticated_ReturnsUnauthorized()
        {
            // Arrange
            var playoff = new SchedulePlayoff { ScheduleNumber = 1, GameNumber = 1 };
            var request = CreateMockRequest(JsonSerializer.Serialize(playoff, JsonOptions));

            // Act
            var response = await _functions.PostSchedulePlayoff(request, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task PostSchedulePlayoff_WithNullBody_ReturnsBadRequest()
        {
            // Arrange
            SetAuthenticated();
            var request = CreateMockRequest("null");

            // Act
            var response = await _functions.PostSchedulePlayoff(request, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task PostSchedulePlayoff_WithValidBody_ReturnsCreated()
        {
            // Arrange
            SetAuthenticated();
            var playoff = new SchedulePlayoff { ScheduleNumber = 1, GameNumber = 1 };
            _mockRepository.Setup(r => r.Insert(It.IsAny<SchedulePlayoff>())).Returns(playoff);
            _mockRepository.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var request = CreateMockRequest(JsonSerializer.Serialize(playoff, JsonOptions));

            // Act
            var response = await _functions.PostSchedulePlayoff(request, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            _mockRepository.Verify(r => r.Insert(It.IsAny<SchedulePlayoff>()), Times.Once);
            _mockRepository.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        // ── PutSchedulePlayoffById ───────────────────────────────────────────────

        [Fact]
        public async Task PutSchedulePlayoffById_WhenUnauthenticated_ReturnsUnauthorized()
        {
            // Arrange
            var playoff = new SchedulePlayoff { SchedulePlayoffId = 1 };
            var request = CreateMockRequest(JsonSerializer.Serialize(playoff, JsonOptions));

            // Act
            var response = await _functions.PutSchedulePlayoffById(request, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task PutSchedulePlayoffById_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            SetAuthenticated();
            var playoff = new SchedulePlayoff { SchedulePlayoffId = 999, ScheduleNumber = 1, GameNumber = 1 };
            _mockRepository.Setup(r => r.GetAll()).Returns(new List<SchedulePlayoff>());

            var request = CreateMockRequest(JsonSerializer.Serialize(playoff, JsonOptions));

            // Act
            var response = await _functions.PutSchedulePlayoffById(request, 999, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task PutSchedulePlayoffById_WithValidData_ReturnsNoContent()
        {
            // Arrange
            SetAuthenticated();
            var existing = new SchedulePlayoff { SchedulePlayoffId = 1, ScheduleNumber = 1, GameNumber = 1 };
            var body = new SchedulePlayoff { SchedulePlayoffId = 1, ScheduleNumber = 1, GameNumber = 2 };
            _mockRepository.Setup(r => r.GetAll()).Returns(new List<SchedulePlayoff> { existing });
            _mockRepository.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var request = CreateMockRequest(JsonSerializer.Serialize(body, JsonOptions));

            // Act
            var response = await _functions.PutSchedulePlayoffById(request, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        }

        // ── PutSchedulePlayoffByKeys ─────────────────────────────────────────────

        [Fact]
        public async Task PutSchedulePlayoffByKeys_WhenUnauthenticated_ReturnsUnauthorized()
        {
            // Arrange
            var playoff = new SchedulePlayoff { ScheduleNumber = 1, GameNumber = 1 };
            var request = CreateMockRequest(JsonSerializer.Serialize(playoff, JsonOptions));

            // Act
            var response = await _functions.PutSchedulePlayoffByKeys(request, 1, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task PutSchedulePlayoffByKeys_WithInvalidKeys_ReturnsNotFound()
        {
            // Arrange
            SetAuthenticated();
            var playoff = new SchedulePlayoff { ScheduleNumber = 99, GameNumber = 99 };
            _mockRepository.Setup(r => r.GetByScheduleAndGameNo(99, 99)).Returns((SchedulePlayoff)null!);

            var request = CreateMockRequest(JsonSerializer.Serialize(playoff, JsonOptions));

            // Act
            var response = await _functions.PutSchedulePlayoffByKeys(request, 99, 99, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task PutSchedulePlayoffByKeys_WithValidData_ReturnsNoContent()
        {
            // Arrange
            SetAuthenticated();
            var existing = new SchedulePlayoff { SchedulePlayoffId = 1, ScheduleNumber = 1, GameNumber = 1 };
            var body = new SchedulePlayoff { ScheduleNumber = 1, GameNumber = 1, HomeTeam = "3", VisitingTeam = "4" };
            _mockRepository.Setup(r => r.GetByScheduleAndGameNo(1, 1)).Returns(existing);
            _mockRepository.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var request = CreateMockRequest(JsonSerializer.Serialize(body, JsonOptions));

            // Act
            var response = await _functions.PutSchedulePlayoffByKeys(request, 1, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        }

        // ── DeleteSchedulePlayoff ────────────────────────────────────────────────

        [Fact]
        public async Task DeleteSchedulePlayoff_WhenUnauthenticated_ReturnsUnauthorized()
        {
            // Arrange
            var request = CreateMockRequest();

            // Act
            var response = await _functions.DeleteSchedulePlayoff(request, 1, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task DeleteSchedulePlayoff_WithInvalidKeys_ReturnsNotFound()
        {
            // Arrange
            SetAuthenticated();
            _mockRepository.Setup(r => r.GetByScheduleAndGameNo(99, 99)).Returns((SchedulePlayoff)null!);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.DeleteSchedulePlayoff(request, 99, 99, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task DeleteSchedulePlayoff_WithValidKeys_ReturnsNoContent()
        {
            // Arrange
            SetAuthenticated();
            var playoff = new SchedulePlayoff { SchedulePlayoffId = 1, ScheduleNumber = 1, GameNumber = 1 };
            _mockRepository.Setup(r => r.GetByScheduleAndGameNo(1, 1)).Returns(playoff);
            _mockRepository.Setup(r => r.Delete(playoff));
            _mockRepository.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.DeleteSchedulePlayoff(request, 1, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
            _mockRepository.Verify(r => r.Delete(playoff), Times.Once);
        }
    }
}
