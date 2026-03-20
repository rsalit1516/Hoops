using System.Collections.Generic;
using System.IO;
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
    public class WebContentFunctionsTest
    {
        private readonly Mock<IWebContentRepository> _mockRepository;
        private readonly Mock<ILogger<WebContentFunctions>> _mockLogger;
        private readonly WebContentFunctions _functions;
        private readonly Mock<FunctionContext> _mockContext;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public WebContentFunctionsTest()
        {
            _mockRepository = new Mock<IWebContentRepository>();
            _mockLogger = new Mock<ILogger<WebContentFunctions>>();
            _functions = new WebContentFunctions(_mockLogger.Object, _mockRepository.Object);
            _mockContext = new Mock<FunctionContext>();
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

        // ── GetAll ───────────────────────────────────────────────────────────────

        [Fact]
        public async Task GetAll_ReturnsOkWithList()
        {
            // Arrange
            var content = new List<WebContentVm>
            {
                new WebContentVm { WebContentId = 1, Title = "News" }
            };
            _mockRepository.Setup(r => r.GetAllAsync(1)).ReturnsAsync(content);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetAll(request);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.GetAllAsync(1), Times.Once);
        }

        // ── GetById ──────────────────────────────────────────────────────────────

        [Fact]
        public async Task GetById_ReturnsOk()
        {
            // Arrange — returns active list (original behavior)
            var content = new List<WebContentVm> { new WebContentVm { WebContentId = 1, Title = "News" } };
            _mockRepository.Setup(r => r.GetActiveWebContentAsync(1)).ReturnsAsync(content);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetById(request, 1);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        // ── GetActive ────────────────────────────────────────────────────────────

        [Fact]
        public async Task GetActive_ReturnsOkWithActiveList()
        {
            // Arrange
            var active = new List<WebContentVm> { new WebContentVm { WebContentId = 2, Title = "Active News" } };
            _mockRepository.Setup(r => r.GetActiveWebContentAsync(1)).ReturnsAsync(active);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetActive(request);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.GetActiveWebContentAsync(1), Times.Once);
        }

        // ── Put ──────────────────────────────────────────────────────────────────

        [Fact]
        public async Task Put_WithNullBody_ReturnsBadRequest()
        {
            // Arrange
            var request = CreateMockRequest("null");

            // Act
            var response = await _functions.Put(request);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task Put_WithValidBody_ReturnsOk()
        {
            // Arrange
            var content = new WebContent { WebContentId = 1, Title = "Updated News" };
            _mockRepository.Setup(r => r.Update(It.IsAny<WebContent>())).Returns(content);
            _mockRepository.Setup(r => r.SaveChanges());
            _mockRepository.Setup(r => r.GetById(1)).Returns(content);

            var request = CreateMockRequest(JsonSerializer.Serialize(content, JsonOptions));

            // Act
            var response = await _functions.Put(request);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.Update(It.IsAny<WebContent>()), Times.Once);
        }

        // ── PutById ──────────────────────────────────────────────────────────────

        [Fact]
        public async Task PutById_WithMismatchedId_ReturnsBadRequest()
        {
            // Arrange
            var content = new WebContent { WebContentId = 2, Title = "News" };
            var request = CreateMockRequest(JsonSerializer.Serialize(content, JsonOptions));

            // Act
            var response = await _functions.PutById(request, 1);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task PutById_WithValidData_ReturnsOk()
        {
            // Arrange
            var content = new WebContent { WebContentId = 1, Title = "Updated" };
            _mockRepository.Setup(r => r.Update(It.IsAny<WebContent>())).Returns(content);
            _mockRepository.Setup(r => r.SaveChanges());

            var request = CreateMockRequest(JsonSerializer.Serialize(content, JsonOptions));

            // Act
            var response = await _functions.PutById(request, 1);

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
            var content = new WebContent { Title = "New Article", CompanyId = 1 };
            var created = new WebContent { WebContentId = 5, Title = "New Article", CompanyId = 1 };
            _mockRepository.Setup(r => r.Insert(It.IsAny<WebContent>())).Returns(created);

            var request = CreateMockRequest(JsonSerializer.Serialize(content, JsonOptions));

            // Act
            var response = await _functions.Post(request);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.Insert(It.IsAny<WebContent>()), Times.Once);
        }

        // ── Delete ───────────────────────────────────────────────────────────────

        [Fact]
        public async Task Delete_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            _mockRepository.Setup(r => r.GetById(999)).Returns((WebContent)null!);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.Delete(request, 999);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task Delete_WithValidId_ReturnsOk()
        {
            // Arrange
            var content = new WebContent { WebContentId = 1, Title = "To Delete" };
            _mockRepository.Setup(r => r.GetById(1)).Returns(content);
            _mockRepository.Setup(r => r.DeleteAsync(1)).Returns(Task.CompletedTask);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.Delete(request, 1);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.DeleteAsync(1), Times.Once);
        }
    }
}
