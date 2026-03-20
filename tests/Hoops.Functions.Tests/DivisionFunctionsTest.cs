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
    public class DivisionFunctionsTest
    {
        private readonly Mock<IDivisionRepository> _mockRepository;
        private readonly Mock<ISeasonService> _mockSeasonService;
        private readonly Mock<ILogger<DivisionFunctions>> _mockLogger;
        private readonly DivisionFunctions _functions;
        private readonly Mock<FunctionContext> _mockContext;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public DivisionFunctionsTest()
        {
            _mockRepository = new Mock<IDivisionRepository>();
            _mockSeasonService = new Mock<ISeasonService>();
            _mockLogger = new Mock<ILogger<DivisionFunctions>>();
            _functions = new DivisionFunctions(_mockRepository.Object, _mockSeasonService.Object, _mockLogger.Object);
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

        // ── GetDivisions ────────────────────────────────────────────────────────

        [Fact]
        public async Task GetDivisions_ReturnsOkWithList()
        {
            // Arrange
            var divisions = new List<Division>
            {
                new Division { DivisionId = 1, DivisionDescription = "Junior", SeasonId = 1 },
                new Division { DivisionId = 2, DivisionDescription = "Senior", SeasonId = 1 }
            };
            _mockRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(divisions);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetDivisions(request);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.GetAllAsync(), Times.Once);
        }

        // ── GetDivisionById ─────────────────────────────────────────────────────

        [Fact]
        public async Task GetDivisionById_WithValidId_ReturnsOk()
        {
            // Arrange
            var division = new Division { DivisionId = 1, DivisionDescription = "Junior" };
            _mockRepository.Setup(r => r.FindByAsync(1)).ReturnsAsync(division);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetDivisionById(request, 1);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task GetDivisionById_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            _mockRepository.Setup(r => r.FindByAsync(999)).ReturnsAsync((Division)null!);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetDivisionById(request, 999);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        // ── GetSeasonDivisions ──────────────────────────────────────────────────

        [Fact]
        public async Task GetSeasonDivisions_ReturnsOkWithList()
        {
            // Arrange
            var divisions = new List<Division>
            {
                new Division { DivisionId = 1, SeasonId = 5 }
            };
            _mockRepository.Setup(r => r.GetSeasonDivisionsAsync(5)).ReturnsAsync(divisions);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetSeasonDivisions(request, 5);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.GetSeasonDivisionsAsync(5), Times.Once);
        }

        // ── PostDivision ─────────────────────────────────────────────────────────

        [Fact]
        public async Task PostDivision_WhenUnauthenticated_ReturnsUnauthorized()
        {
            // Arrange — context.Items has no "User"
            var division = new Division { DivisionDescription = "Test", SeasonId = 1 };
            var request = CreateMockRequest(JsonSerializer.Serialize(division, JsonOptions));

            // Act
            var response = await _functions.PostDivision(request, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
            _mockRepository.Verify(r => r.InsertAsync(It.IsAny<Division>()), Times.Never);
        }

        [Fact]
        public async Task PostDivision_WithNullBody_ReturnsBadRequest()
        {
            // Arrange
            SetAuthenticated();
            var request = CreateMockRequest("null");

            // Act
            var response = await _functions.PostDivision(request, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task PostDivision_WithValidBody_ReturnsCreated()
        {
            // Arrange
            SetAuthenticated();
            var division = new Division { DivisionDescription = "Junior", SeasonId = 1 };
            _mockRepository.Setup(r => r.InsertAsync(It.IsAny<Division>())).ReturnsAsync(division);
            _mockRepository.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var request = CreateMockRequest(JsonSerializer.Serialize(division, JsonOptions));

            // Act
            var response = await _functions.PostDivision(request, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            _mockRepository.Verify(r => r.InsertAsync(It.IsAny<Division>()), Times.Once);
            _mockRepository.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        // ── PutDivision ──────────────────────────────────────────────────────────

        [Fact]
        public async Task PutDivision_WhenUnauthenticated_ReturnsUnauthorized()
        {
            // Arrange
            var division = new Division { DivisionId = 1, DivisionDescription = "Junior" };
            var request = CreateMockRequest(JsonSerializer.Serialize(division, JsonOptions));

            // Act
            var response = await _functions.PutDivision(request, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task PutDivision_WithMismatchedId_ReturnsBadRequest()
        {
            // Arrange
            SetAuthenticated();
            var division = new Division { DivisionId = 2, DivisionDescription = "Senior" };
            var request = CreateMockRequest(JsonSerializer.Serialize(division, JsonOptions));

            // Act
            var response = await _functions.PutDivision(request, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task PutDivision_WithValidData_ReturnsOk()
        {
            // Arrange
            SetAuthenticated();
            var division = new Division { DivisionId = 1, DivisionDescription = "Updated", SeasonId = 1 };
            _mockRepository.Setup(r => r.Update(It.IsAny<Division>())).Returns(division);
            _mockRepository.Setup(r => r.SaveChanges());

            var request = CreateMockRequest(JsonSerializer.Serialize(division, JsonOptions));

            // Act
            var response = await _functions.PutDivision(request, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        // ── DeleteDivision ───────────────────────────────────────────────────────

        [Fact]
        public async Task DeleteDivision_WhenUnauthenticated_ReturnsUnauthorized()
        {
            // Arrange
            var request = CreateMockRequest();

            // Act
            var response = await _functions.DeleteDivision(request, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task DeleteDivision_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            SetAuthenticated();
            _mockRepository.Setup(r => r.FindByAsync(999)).ThrowsAsync(new System.Exception("not found"));
            var request = CreateMockRequest();

            // Act
            var response = await _functions.DeleteDivision(request, 999, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task DeleteDivision_WithValidId_ReturnsOk()
        {
            // Arrange
            SetAuthenticated();
            var division = new Division { DivisionId = 1, DivisionDescription = "Junior" };
            _mockRepository.Setup(r => r.FindByAsync(1)).ReturnsAsync(division);
            _mockRepository.Setup(r => r.DeleteAsync(1)).Returns(Task.CompletedTask);
            _mockRepository.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.DeleteDivision(request, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
    }
}
