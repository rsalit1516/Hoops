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
    public class TeamFunctionsTest
    {
        private readonly Mock<ITeamRepository> _mockRepository;
        private readonly Mock<IScheduleDivTeamsRepository> _mockScheduleDivTeamsRepository;
        private readonly Mock<ILogger<TeamFunctions>> _mockLogger;
        private readonly TeamFunctions _functions;
        private readonly Mock<FunctionContext> _mockContext;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public TeamFunctionsTest()
        {
            _mockRepository = new Mock<ITeamRepository>();
            _mockScheduleDivTeamsRepository = new Mock<IScheduleDivTeamsRepository>();
            _mockLogger = new Mock<ILogger<TeamFunctions>>();
            _functions = new TeamFunctions(_mockRepository.Object, _mockScheduleDivTeamsRepository.Object, _mockLogger.Object);
            _mockContext = new Mock<FunctionContext>();

            // Default: unauthenticated
            _mockContext.Setup(c => c.Items).Returns(new Dictionary<object, object>());

            var mockFunctionDef = new Mock<FunctionDefinition>();
            mockFunctionDef.Setup(f => f.Name).Returns("TestFunction");
            _mockContext.Setup(c => c.FunctionDefinition).Returns(mockFunctionDef.Object);
        }

        private HttpRequestData CreateMockRequest(string body = "")
        {
            var mockRequest = new Mock<HttpRequestData>(_mockContext.Object);
            var bodyStream = new MemoryStream(Encoding.UTF8.GetBytes(body));

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

        private void SetAuthenticated()
        {
            var items = new Dictionary<object, object> { ["User"] = new { UserId = 1 } };
            _mockContext.Setup(c => c.Items).Returns(items);
        }

        // ── GetTeams ─────────────────────────────────────────────────────────────

        [Fact]
        public async Task GetTeams_ReturnsOkWithList()
        {
            // Arrange
            var teams = new List<Team>
            {
                new Team { TeamId = 1, TeamName = "Eagles", DivisionId = 1 },
                new Team { TeamId = 2, TeamName = "Hawks", DivisionId = 1 }
            };
            _mockRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(teams);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetTeams(request);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.GetAllAsync(), Times.Once);
        }

        // ── GetTeamById ──────────────────────────────────────────────────────────

        [Fact]
        public async Task GetTeamById_WithValidId_ReturnsOk()
        {
            // Arrange
            var team = new Team { TeamId = 1, TeamName = "Eagles" };
            _mockRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(team);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetTeamById(request, 1);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task GetTeamById_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            _mockRepository.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Team)null!);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetTeamById(request, 999);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        // ── GetSeasonTeams ───────────────────────────────────────────────────────

        [Fact]
        public void GetSeasonTeams_WithValidId_ReturnsOk()
        {
            // Arrange
            var teams = new List<Team> { new Team { TeamId = 1, TeamName = "Eagles" } };
            _mockRepository.Setup(r => r.GetSeasonTeams(1)).Returns(teams);
            var request = CreateMockRequest();

            // Act
            var response = _functions.GetSeasonTeams(request, 1);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public void GetSeasonTeams_WithZeroId_ReturnsBadRequest()
        {
            // Arrange
            var request = CreateMockRequest();

            // Act
            var response = _functions.GetSeasonTeams(request, 0);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        // ── PostTeam ─────────────────────────────────────────────────────────────

        [Fact]
        public async Task PostTeam_WhenUnauthenticated_ReturnsUnauthorized()
        {
            // Arrange
            var team = new Team { TeamName = "Eagles", DivisionId = 1 };
            var request = CreateMockRequest(JsonSerializer.Serialize(team, JsonOptions));

            // Act
            var response = await _functions.PostTeam(request, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task PostTeam_WithNullBody_ReturnsBadRequest()
        {
            // Arrange
            SetAuthenticated();
            var request = CreateMockRequest("null");

            // Act
            var response = await _functions.PostTeam(request, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task PostTeam_WithValidBody_ReturnsCreated()
        {
            // Arrange
            SetAuthenticated();
            var team = new Team { TeamName = "Eagles", DivisionId = 1 };
            _mockRepository.Setup(r => r.Insert(It.IsAny<Team>())).Returns(new Team { TeamId = 1, TeamName = "Eagles" });
            _mockRepository.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var request = CreateMockRequest(JsonSerializer.Serialize(team, JsonOptions));

            // Act
            var response = await _functions.PostTeam(request, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            _mockRepository.Verify(r => r.Insert(It.IsAny<Team>()), Times.Once);
            _mockRepository.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        // ── PutTeam ──────────────────────────────────────────────────────────────

        [Fact]
        public async Task PutTeam_WhenUnauthenticated_ReturnsUnauthorized()
        {
            // Arrange
            var team = new Team { TeamId = 1, TeamName = "Eagles" };
            var request = CreateMockRequest(JsonSerializer.Serialize(team, JsonOptions));

            // Act
            var response = await _functions.PutTeam(request, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task PutTeam_WithMismatchedId_ReturnsBadRequest()
        {
            // Arrange
            SetAuthenticated();
            var team = new Team { TeamId = 2, TeamName = "Hawks" };
            var request = CreateMockRequest(JsonSerializer.Serialize(team, JsonOptions));

            // Act
            var response = await _functions.PutTeam(request, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task PutTeam_WithValidData_ReturnsNoContent()
        {
            // Arrange
            SetAuthenticated();
            var team = new Team { TeamId = 1, TeamName = "Eagles Updated", DivisionId = 1 };
            _mockRepository.Setup(r => r.Update(It.IsAny<Team>())).Returns(team);
            _mockRepository.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var request = CreateMockRequest(JsonSerializer.Serialize(team, JsonOptions));

            // Act
            var response = await _functions.PutTeam(request, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        }

        // ── DeleteTeam ───────────────────────────────────────────────────────────

        [Fact]
        public async Task DeleteTeam_WhenUnauthenticated_ReturnsUnauthorized()
        {
            // Arrange
            var request = CreateMockRequest();

            // Act
            var response = await _functions.DeleteTeam(request, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task DeleteTeam_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            SetAuthenticated();
            _mockRepository.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Team)null!);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.DeleteTeam(request, 999, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task DeleteTeam_WithValidId_ReturnsOk()
        {
            // Arrange
            SetAuthenticated();
            var team = new Team { TeamId = 1, TeamName = "Eagles" };
            _mockRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(team);
            _mockRepository.Setup(r => r.Delete(team));
            _mockRepository.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.DeleteTeam(request, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.Delete(team), Times.Once);
        }
    }
}
