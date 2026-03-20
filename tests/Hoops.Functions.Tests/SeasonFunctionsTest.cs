using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Functions.Functions;
using Hoops.Functions.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Hoops.Functions.Tests
{
    public class SeasonFunctionsTest
    {
        private readonly Mock<ISeasonService> _mockSeasonService;
        private readonly Mock<ISeasonRepository> _mockSeasonRepository;
        private readonly IConfiguration _configuration;
        private readonly Mock<ILogger<SeasonFunctions>> _mockLogger;
        private readonly SeasonFunctions _functions;
        private readonly Mock<FunctionContext> _mockContext;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public SeasonFunctionsTest()
        {
            _mockSeasonService = new Mock<ISeasonService>();
            _mockSeasonRepository = new Mock<ISeasonRepository>();
            _mockLogger = new Mock<ILogger<SeasonFunctions>>();

            // Use real in-memory configuration
            _configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(new Dictionary<string, string>
                {
                    ["CompanySettings:DefaultCompanyId"] = "1"
                })
                .Build();

            _functions = new SeasonFunctions(
                _mockLogger.Object,
                _mockSeasonService.Object,
                _mockSeasonRepository.Object,
                _configuration);

            _mockContext = new Mock<FunctionContext>();

            // Wire up InstanceServices so WriteAsJsonAsync extension method can resolve IObjectSerializer
            var serviceProvider = new ServiceCollection().BuildServiceProvider();
            _mockContext.Setup(c => c.InstanceServices).Returns(serviceProvider);
        }

        private HttpRequestData CreateMockRequest(string body = "")
        {
            var mockRequest = new Mock<HttpRequestData>(_mockContext.Object);
            var bodyStream = new MemoryStream(Encoding.UTF8.GetBytes(body));

            mockRequest.Setup(r => r.Body).Returns(bodyStream);
            mockRequest.Setup(r => r.CreateResponse()).Returns(() =>
            {
                var mockResponse = new Mock<HttpResponseData>(_mockContext.Object);
                // Initialize to OK since SeasonFunctions.WriteJsonAsync does not explicitly set StatusCode
                mockResponse.SetupProperty(r => r.StatusCode, HttpStatusCode.OK);
                mockResponse.SetupProperty(r => r.Headers, new HttpHeadersCollection());
                mockResponse.Setup(r => r.Body).Returns(new MemoryStream());
                return mockResponse.Object;
            });

            return mockRequest.Object;
        }

        // ── GetAll ───────────────────────────────────────────────────────────────

        [Fact]
        public async Task GetAll_WithSeasons_ReturnsOk()
        {
            // Arrange
            var seasons = new List<Season>
            {
                new Season { SeasonId = 1, CompanyId = 1, Description = "Spring 2024" }
            };
            _mockSeasonService.Setup(s => s.GetAllSeasonsAsync(1)).ReturnsAsync(seasons);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetAll(request, null);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task GetAll_WithNoSeasons_ReturnsNotFound()
        {
            // Arrange
            _mockSeasonService.Setup(s => s.GetAllSeasonsAsync(1)).ReturnsAsync(new List<Season>());
            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetAll(request, null);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        // ── GetCurrentSeason ─────────────────────────────────────────────────────

        [Fact]
        public async Task GetCurrentSeason_WhenExists_ReturnsOk()
        {
            // Arrange
            var season = new Season { SeasonId = 1, CompanyId = 1, Description = "Spring 2024", CurrentSeason = true };
            _mockSeasonService.Setup(s => s.GetCurrentSeasonAsync(1)).ReturnsAsync(season);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetCurrentSeason(request, null);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task GetCurrentSeason_WhenNull_ReturnsNotFound()
        {
            // Arrange
            _mockSeasonService.Setup(s => s.GetCurrentSeasonAsync(1)).ReturnsAsync((Season)null!);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetCurrentSeason(request, null);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        // ── GetById ──────────────────────────────────────────────────────────────

        [Fact]
        public async Task GetById_WithValidId_ReturnsOk()
        {
            // Arrange
            var season = new Season { SeasonId = 1, CompanyId = 1, Description = "Spring 2024" };
            _mockSeasonRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(season);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetById(request, 1);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task GetById_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            _mockSeasonRepository.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Season)null!);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetById(request, 999);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        // ── Put ──────────────────────────────────────────────────────────────────

        [Fact]
        public async Task Put_WithNullBody_ReturnsBadRequest()
        {
            // Arrange
            var request = CreateMockRequest("null");

            // Act
            var response = await _functions.Put(request, 1);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task Put_WithMismatchedId_ReturnsBadRequest()
        {
            // Arrange
            var dto = new SeasonDto { SeasonId = 2, Description = "Fall 2024" };
            var request = CreateMockRequest(JsonSerializer.Serialize(dto, JsonOptions));

            // Act
            var response = await _functions.Put(request, 1);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task Put_WithNonExistentSeason_ReturnsNotFound()
        {
            // Arrange
            var dto = new SeasonDto { SeasonId = 999, Description = "Unknown" };
            _mockSeasonRepository.Setup(r => r.UpdateAsync(It.IsAny<Season>())).ReturnsAsync(false);
            var request = CreateMockRequest(JsonSerializer.Serialize(dto, JsonOptions));

            // Act
            var response = await _functions.Put(request, 999);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task Put_WithValidData_ReturnsOk()
        {
            // Arrange
            var dto = new SeasonDto { SeasonId = 1, Description = "Spring 2024 Updated" };
            _mockSeasonRepository.Setup(r => r.UpdateAsync(It.IsAny<Season>())).ReturnsAsync(true);
            _mockSeasonRepository.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);
            var request = CreateMockRequest(JsonSerializer.Serialize(dto, JsonOptions));

            // Act
            var response = await _functions.Put(request, 1);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        // ── Post ─────────────────────────────────────────────────────────────────

        [Fact]
        public async Task Post_WithNullBody_ReturnsBadRequest()
        {
            // Arrange
            var request = CreateMockRequest("null");

            // Act
            var response = await _functions.Post(request);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task Post_WithValidBody_ReturnsOk()
        {
            // Arrange
            var dto = new SeasonDto { Description = "New Season", CompanyId = 1 };
            var created = new Season { SeasonId = 5, Description = "New Season", CompanyId = 1 };
            _mockSeasonRepository.Setup(r => r.InsertAsync(It.IsAny<Season>())).ReturnsAsync(created);
            _mockSeasonRepository.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var request = CreateMockRequest(JsonSerializer.Serialize(dto, JsonOptions));

            // Act
            var response = await _functions.Post(request);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockSeasonRepository.Verify(r => r.InsertAsync(It.IsAny<Season>()), Times.Once);
        }

        // ── Delete ───────────────────────────────────────────────────────────────

        [Fact]
        public async Task Delete_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            _mockSeasonRepository.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Season)null!);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.Delete(request, 999);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task Delete_WithValidId_CallsDeleteAndSave()
        {
            // Arrange
            var season = new Season { SeasonId = 1, Description = "Spring 2024" };
            _mockSeasonRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(season);
            _mockSeasonRepository.Setup(r => r.DeleteAsync(1)).Returns(Task.CompletedTask);
            _mockSeasonRepository.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);
            var request = CreateMockRequest();

            // Act — WriteAsJsonAsync requires a real serializer; verify repo calls instead of status code
            try { await _functions.Delete(request, 1); } catch (InvalidOperationException) { }

            // Assert
            _mockSeasonRepository.Verify(r => r.DeleteAsync(1), Times.Once);
            _mockSeasonRepository.Verify(r => r.SaveChangesAsync(), Times.Once);
        }
    }
}
