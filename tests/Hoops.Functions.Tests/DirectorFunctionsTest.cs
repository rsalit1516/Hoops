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
    public class DirectorFunctionsTest
    {
        private readonly Mock<IDirectorRepository> _mockRepository;
        private readonly Mock<ILogger<DirectorFunctions>> _mockLogger;
        private readonly DirectorFunctions _functions;
        private readonly Mock<FunctionContext> _mockContext;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public DirectorFunctionsTest()
        {
            _mockRepository = new Mock<IDirectorRepository>();
            _mockLogger = new Mock<ILogger<DirectorFunctions>>();
            _functions = new DirectorFunctions(_mockRepository.Object, _mockLogger.Object);
            _mockContext = new Mock<FunctionContext>();

            // Default: unauthenticated (empty Items)
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

        // ── GetDirectors ────────────────────────────────────────────────────────

        [Fact]
        public void GetDirectors_ReturnsOkWithList()
        {
            // Arrange
            var directors = new List<VwDirector>
            {
                new VwDirector { DirectorId = 1, PersonId = 10, Name = "Jane Smith", CompanyId = 1 },
                new VwDirector { DirectorId = 2, PersonId = 20, Name = "Bob Jones", CompanyId = 1 }
            };
            _mockRepository.Setup(r => r.GetAll(1)).Returns(directors);

            var request = CreateMockRequest();

            // Act
            var response = _functions.Get(request);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.GetAll(1), Times.Once);
        }

        // ── GetDirectorVolunteers ────────────────────────────────────────────────

        [Fact]
        public void GetDirectorVolunteers_ReturnsOkWithList()
        {
            // Arrange
            var volunteers = new List<VwDirector>
            {
                new VwDirector { PersonId = 10, Name = "Jane Smith" },
                new VwDirector { PersonId = 20, Name = "Bob Jones" }
            };
            _mockRepository.Setup(r => r.GetDirectorVolunteers(1)).Returns(volunteers);

            var request = CreateMockRequest();

            // Act
            var response = _functions.GetDirectorVolunteers(request);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.GetDirectorVolunteers(1), Times.Once);
        }

        // ── GetDirectorById ─────────────────────────────────────────────────────

        [Fact]
        public async Task GetDirectorById_WithValidId_ReturnsOk()
        {
            // Arrange
            var director = new Director { DirectorId = 1, PersonId = 10, Title = "President", CompanyId = 1 };
            _mockRepository.Setup(r => r.FindByAsync(1)).ReturnsAsync(director);

            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetDirectorById(request, 1);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task GetDirectorById_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            _mockRepository.Setup(r => r.FindByAsync(999)).ReturnsAsync((Director)null!);

            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetDirectorById(request, 999);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        // ── PostDirector ─────────────────────────────────────────────────────────

        [Fact]
        public async Task PostDirector_WhenUnauthenticated_ReturnsUnauthorized()
        {
            // Arrange — context.Items has no "User" (default setup)
            var request = CreateMockRequest(JsonSerializer.Serialize(new Director { PersonId = 10 }, JsonOptions));

            // Act
            var response = await _functions.PostDirector(request, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
            _mockRepository.Verify(r => r.Insert(It.IsAny<Director>()), Times.Never);
        }

        [Fact]
        public async Task PostDirector_WithNullBody_ReturnsBadRequest()
        {
            // Arrange
            SetAuthenticated();
            var request = CreateMockRequest("null");

            // Act
            var response = await _functions.PostDirector(request, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task PostDirector_WithValidBody_ReturnsCreated()
        {
            // Arrange
            SetAuthenticated();
            var director = new Director { PersonId = 10, Title = "President", CompanyId = 1 };
            var created = new Director { DirectorId = 5, PersonId = 10, Title = "President", CompanyId = 1 };

            _mockRepository.Setup(r => r.Insert(It.IsAny<Director>())).Returns(created);
            _mockRepository.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var request = CreateMockRequest(JsonSerializer.Serialize(director, JsonOptions));

            // Act
            var response = await _functions.PostDirector(request, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            _mockRepository.Verify(r => r.Insert(It.IsAny<Director>()), Times.Once);
            _mockRepository.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        // ── PutDirector ──────────────────────────────────────────────────────────

        [Fact]
        public async Task PutDirector_WhenUnauthenticated_ReturnsUnauthorized()
        {
            // Arrange — context.Items has no "User"
            var director = new Director { DirectorId = 1, PersonId = 10 };
            var request = CreateMockRequest(JsonSerializer.Serialize(director, JsonOptions));

            // Act
            var response = await _functions.PutDirector(request, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
            _mockRepository.Verify(r => r.Update(It.IsAny<Director>()), Times.Never);
        }

        [Fact]
        public async Task PutDirector_WithMismatchedId_ReturnsBadRequest()
        {
            // Arrange
            SetAuthenticated();
            var director = new Director { DirectorId = 2, PersonId = 10 };
            var request = CreateMockRequest(JsonSerializer.Serialize(director, JsonOptions));

            // Act
            var response = await _functions.PutDirector(request, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task PutDirector_WithValidData_ReturnsOk()
        {
            // Arrange
            SetAuthenticated();
            var director = new Director { DirectorId = 1, PersonId = 10, Title = "Vice President", CompanyId = 1 };

            _mockRepository.Setup(r => r.Update(It.IsAny<Director>())).Returns(director);
            _mockRepository.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var request = CreateMockRequest(JsonSerializer.Serialize(director, JsonOptions));

            // Act
            var response = await _functions.PutDirector(request, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.Update(It.IsAny<Director>()), Times.Once);
            _mockRepository.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        // ── DeleteDirector ───────────────────────────────────────────────────────

        [Fact]
        public async Task DeleteDirector_WhenUnauthenticated_ReturnsUnauthorized()
        {
            // Arrange — context.Items has no "User"
            var request = CreateMockRequest();

            // Act
            var response = await _functions.DeleteDirector(request, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
            _mockRepository.Verify(r => r.Delete(It.IsAny<Director>()), Times.Never);
        }

        [Fact]
        public async Task DeleteDirector_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            SetAuthenticated();
            _mockRepository.Setup(r => r.FindByAsync(999)).ReturnsAsync((Director)null!);

            var request = CreateMockRequest();

            // Act
            var response = await _functions.DeleteDirector(request, 999, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task DeleteDirector_WithValidId_ReturnsOkAndDeletes()
        {
            // Arrange
            SetAuthenticated();
            var director = new Director { DirectorId = 1, PersonId = 10, CompanyId = 1 };

            _mockRepository.Setup(r => r.FindByAsync(1)).ReturnsAsync(director);
            _mockRepository.Setup(r => r.Delete(director));
            _mockRepository.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var request = CreateMockRequest();

            // Act
            var response = await _functions.DeleteDirector(request, 1, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.Delete(director), Times.Once);
            _mockRepository.Verify(r => r.SaveChangesAsync(), Times.Once);
        }
    }
}
