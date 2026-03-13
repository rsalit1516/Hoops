using System;
using System.IO;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Functions.Functions;
using Hoops.Infrastructure.Data;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace Hoops.Functions.Tests
{
    public class WebContentTypeFunctionsTest
    {
        private readonly Mock<FunctionContext> _mockFunctionContext;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public WebContentTypeFunctionsTest()
        {
            _mockFunctionContext = new Mock<FunctionContext>();
        }

        private static hoopsContext CreateDbContext(string dbName)
        {
            var options = new DbContextOptionsBuilder<hoopsContext>()
                .UseInMemoryDatabase(dbName)
                .Options;
            return new hoopsContext(options);
        }

        private HttpRequestData CreateMockRequest(string body = "")
        {
            var mockRequest = new Mock<HttpRequestData>(_mockFunctionContext.Object);
            var bodyStream = new MemoryStream(Encoding.UTF8.GetBytes(body));

            mockRequest.Setup(r => r.Body).Returns(bodyStream);
            mockRequest.Setup(r => r.CreateResponse()).Returns(() =>
            {
                var mockResponse = new Mock<HttpResponseData>(_mockFunctionContext.Object);
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
            using var db = CreateDbContext(Guid.NewGuid().ToString());
            db.WebContentTypes.Add(new WebContentType { WebContentTypeId = 1, WebContentTypeDescription = "News" });
            db.WebContentTypes.Add(new WebContentType { WebContentTypeId = 2, WebContentTypeDescription = "Events" });
            await db.SaveChangesAsync();

            var functions = new WebContentTypeFunctions(db);
            var request = CreateMockRequest();

            // Act
            var response = await functions.GetAll(request);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        // ── GetById ──────────────────────────────────────────────────────────────

        [Fact]
        public async Task GetById_WithValidId_ReturnsOk()
        {
            // Arrange
            using var db = CreateDbContext(Guid.NewGuid().ToString());
            db.WebContentTypes.Add(new WebContentType { WebContentTypeId = 1, WebContentTypeDescription = "News" });
            await db.SaveChangesAsync();

            var functions = new WebContentTypeFunctions(db);
            var request = CreateMockRequest();

            // Act
            var response = await functions.GetById(request, 1);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task GetById_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            using var db = CreateDbContext(Guid.NewGuid().ToString());
            var functions = new WebContentTypeFunctions(db);
            var request = CreateMockRequest();

            // Act
            var response = await functions.GetById(request, 999);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        // ── Post ─────────────────────────────────────────────────────────────────

        [Fact]
        public async Task Post_WithNullBody_ReturnsBadRequest()
        {
            // Arrange
            using var db = CreateDbContext(Guid.NewGuid().ToString());
            var functions = new WebContentTypeFunctions(db);
            var request = CreateMockRequest("null");

            // Act
            var response = await functions.Post(request);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task Post_WithValidBody_ReturnsOk()
        {
            // Arrange
            using var db = CreateDbContext(Guid.NewGuid().ToString());
            var functions = new WebContentTypeFunctions(db);
            var contentType = new WebContentType { WebContentTypeId = 1, WebContentTypeDescription = "Announcements" };
            var request = CreateMockRequest(JsonSerializer.Serialize(contentType, JsonOptions));

            // Act
            var response = await functions.Post(request);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        // ── Delete ───────────────────────────────────────────────────────────────

        [Fact]
        public async Task Delete_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            using var db = CreateDbContext(Guid.NewGuid().ToString());
            var functions = new WebContentTypeFunctions(db);
            var request = CreateMockRequest();

            // Act
            var response = await functions.Delete(request, 999);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task Delete_WithValidId_ReturnsOk()
        {
            // Arrange
            using var db = CreateDbContext(Guid.NewGuid().ToString());
            db.WebContentTypes.Add(new WebContentType { WebContentTypeId = 1, WebContentTypeDescription = "News" });
            await db.SaveChangesAsync();

            var functions = new WebContentTypeFunctions(db);
            var request = CreateMockRequest();

            // Act
            var response = await functions.Delete(request, 1);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
    }
}
