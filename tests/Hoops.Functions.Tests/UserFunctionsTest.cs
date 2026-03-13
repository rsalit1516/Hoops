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
    public class UserFunctionsTest
    {
        private readonly Mock<FunctionContext> _mockFunctionContext;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public UserFunctionsTest()
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

        private static User SeedUser(hoopsContext db, int userId = 1, string userName = "testuser")
        {
            var user = new User
            {
                UserId = userId,
                UserName = userName,
                Pword = "password",
                Name = "Test User",
                HouseId = 1,
                UserType = 1,
                CompanyId = 1
            };
            db.Users.Add(user);
            db.SaveChanges();
            return user;
        }

        // ── GetAll ───────────────────────────────────────────────────────────────

        [Fact]
        public async Task GetAll_ReturnsOkWithUsers()
        {
            // Arrange
            using var db = CreateDbContext(Guid.NewGuid().ToString());
            SeedUser(db, userId: 1, userName: "alice");
            SeedUser(db, userId: 2, userName: "bob");
            var functions = new UserFunctions(db);
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
            SeedUser(db, userId: 1);
            var functions = new UserFunctions(db);
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
            var functions = new UserFunctions(db);
            var request = CreateMockRequest();

            // Act
            var response = await functions.GetById(request, 999);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        // ── Put ──────────────────────────────────────────────────────────────────

        [Fact]
        public async Task Put_WithNullBody_ReturnsBadRequest()
        {
            // Arrange
            using var db = CreateDbContext(Guid.NewGuid().ToString());
            var functions = new UserFunctions(db);
            var request = CreateMockRequest("null");

            // Act
            var response = await functions.Put(request, 1);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task Put_WithMismatchedId_ReturnsBadRequest()
        {
            // Arrange
            using var db = CreateDbContext(Guid.NewGuid().ToString());
            var functions = new UserFunctions(db);
            var user = new User { UserId = 2, UserName = "bob", CompanyId = 1 };
            var request = CreateMockRequest(JsonSerializer.Serialize(user, JsonOptions));

            // Act
            var response = await functions.Put(request, 1);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task Put_WithNonExistentUser_ReturnsNotFound()
        {
            // Arrange
            using var db = CreateDbContext(Guid.NewGuid().ToString());
            var functions = new UserFunctions(db);
            var user = new User { UserId = 999, UserName = "ghost", CompanyId = 1 };
            var request = CreateMockRequest(JsonSerializer.Serialize(user, JsonOptions));

            // Act
            var response = await functions.Put(request, 999);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task Put_WithValidData_ReturnsNoContent()
        {
            // Arrange
            using var db = CreateDbContext(Guid.NewGuid().ToString());
            SeedUser(db, userId: 1);
            var functions = new UserFunctions(db);
            var user = new User { UserId = 1, UserName = "testuser_updated", CompanyId = 1, HouseId = 1, UserType = 1, Name = "Updated" };
            var request = CreateMockRequest(JsonSerializer.Serialize(user, JsonOptions));

            // Act
            var response = await functions.Put(request, 1);

            // Assert
            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        }

        // ── Post ─────────────────────────────────────────────────────────────────

        [Fact]
        public async Task Post_WithNullBody_ReturnsBadRequest()
        {
            // Arrange
            using var db = CreateDbContext(Guid.NewGuid().ToString());
            var functions = new UserFunctions(db);
            var request = CreateMockRequest("null");

            // Act
            var response = await functions.Post(request);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task Post_WithValidBody_ReturnsCreated()
        {
            // Arrange
            using var db = CreateDbContext(Guid.NewGuid().ToString());
            var functions = new UserFunctions(db);
            var user = new User { UserId = 0, UserName = "newuser", Pword = "pass", CompanyId = 1, HouseId = 1, UserType = 1, Name = "New" };
            var request = CreateMockRequest(JsonSerializer.Serialize(user, JsonOptions));

            // Act
            var response = await functions.Post(request);

            // Assert
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        }

        // ── Delete ───────────────────────────────────────────────────────────────

        [Fact]
        public async Task Delete_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            using var db = CreateDbContext(Guid.NewGuid().ToString());
            var functions = new UserFunctions(db);
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
            SeedUser(db, userId: 1);
            var functions = new UserFunctions(db);
            var request = CreateMockRequest();

            // Act
            var response = await functions.Delete(request, 1);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
    }
}
