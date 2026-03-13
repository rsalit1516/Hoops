using System;
using System.IO;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Functions.Functions;
using Hoops.Functions.Utils;
using Hoops.Infrastructure.Data;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Moq;
using Xunit;

namespace Hoops.Functions.Tests
{
    public class AuthFunctionsTest
    {
        private readonly Mock<FunctionContext> _mockFunctionContext;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public AuthFunctionsTest()
        {
            _mockFunctionContext = new Mock<FunctionContext>();
        }

        // ── Helpers ───────────────────────────────────────────────────────────────

        private static hoopsContext CreateDbContext(string dbName)
        {
            var options = new DbContextOptionsBuilder<hoopsContext>()
                .UseInMemoryDatabase(dbName)
                .Options;
            return new hoopsContext(options);
        }

        private AuthFunctions CreateSut(hoopsContext db, AuthContext? authContext = null, bool isDevelopment = true)
        {
            authContext ??= new AuthContext();
            var mockEnv = new Mock<IHostEnvironment>();
            mockEnv.Setup(e => e.EnvironmentName)
                   .Returns(isDevelopment ? Environments.Development : Environments.Production);
            return new AuthFunctions(db, authContext, mockEnv.Object);
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

        private static User SeedUser(hoopsContext db, int userId = 1, string userName = "testuser",
            string plainPassword = "password123")
        {
            var user = new User
            {
                UserId = userId,
                UserName = userName,
                Pword = plainPassword,   // GetUser checks: u.Pword == password
                Name = "John Doe",
                HouseId = 1,
                UserType = 1,
                CompanyId = 1
            };
            db.Users.Add(user);
            db.SaveChanges();
            return user;
        }

        // ── Login ─────────────────────────────────────────────────────────────────

        [Fact]
        public async Task Login_WithNullBody_ReturnsBadRequest()
        {
            // Arrange
            using var db = CreateDbContext(Guid.NewGuid().ToString());
            var functions = CreateSut(db);
            // JSON "null" deserializes to null for a reference-type record, triggering the null check
            var request = CreateMockRequest("null");

            // Act
            var response = await functions.Login(request);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task Login_WithUnknownUser_ReturnsUnauthorized()
        {
            // Arrange
            using var db = CreateDbContext(Guid.NewGuid().ToString());
            // No users seeded
            var functions = CreateSut(db);
            var body = JsonSerializer.Serialize(new { userName = "nobody", password = "password123" }, JsonOptions);
            var request = CreateMockRequest(body);

            // Act
            var response = await functions.Login(request);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task Login_WithWrongPassword_ReturnsUnauthorized()
        {
            // Arrange
            using var db = CreateDbContext(Guid.NewGuid().ToString());
            SeedUser(db);
            var functions = CreateSut(db);
            var body = JsonSerializer.Serialize(new { userName = "testuser", password = "wrongpassword" }, JsonOptions);
            var request = CreateMockRequest(body);

            // Act
            var response = await functions.Login(request);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task Login_WithValidCredentials_ReturnsOk()
        {
            // Arrange
            using var db = CreateDbContext(Guid.NewGuid().ToString());
            SeedUser(db);
            var functions = CreateSut(db);
            var body = JsonSerializer.Serialize(new { userName = "testuser", password = "password123" }, JsonOptions);
            var request = CreateMockRequest(body);

            // Act
            var response = await functions.Login(request);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task Login_WithValidCredentials_SetsAuthCookieWithUserId()
        {
            // Arrange
            using var db = CreateDbContext(Guid.NewGuid().ToString());
            SeedUser(db, userId: 42);
            var functions = CreateSut(db, isDevelopment: true);
            var body = JsonSerializer.Serialize(new { userName = "testuser", password = "password123" }, JsonOptions);
            var request = CreateMockRequest(body);

            // Act
            var response = await functions.Login(request);

            // Assert
            Assert.True(response.Headers.TryGetValues("Set-Cookie", out var values));
            var cookie = string.Join("", values);
            Assert.Contains("hoops.auth=42", cookie);
            Assert.Contains("HttpOnly", cookie);
        }

        [Fact]
        public async Task Login_InDevelopment_UsesSameSiteLax()
        {
            // Arrange
            using var db = CreateDbContext(Guid.NewGuid().ToString());
            SeedUser(db);
            var functions = CreateSut(db, isDevelopment: true);
            var body = JsonSerializer.Serialize(new { userName = "testuser", password = "password123" }, JsonOptions);
            var request = CreateMockRequest(body);

            // Act
            var response = await functions.Login(request);

            // Assert
            Assert.True(response.Headers.TryGetValues("Set-Cookie", out var values));
            Assert.Contains("SameSite=Lax", string.Join("", values));
        }

        [Fact]
        public async Task Login_InProduction_UsesSameSiteNoneAndSecure()
        {
            // Arrange
            using var db = CreateDbContext(Guid.NewGuid().ToString());
            SeedUser(db);
            var functions = CreateSut(db, isDevelopment: false);
            var body = JsonSerializer.Serialize(new { userName = "testuser", password = "password123" }, JsonOptions);
            var request = CreateMockRequest(body);

            // Act
            var response = await functions.Login(request);

            // Assert
            Assert.True(response.Headers.TryGetValues("Set-Cookie", out var values));
            var cookie = string.Join("", values);
            Assert.Contains("SameSite=None", cookie);
            Assert.Contains("Secure", cookie);
        }

        // ── Me ────────────────────────────────────────────────────────────────────

        [Fact]
        public async Task Me_WithNoUserId_ReturnsUnauthorized()
        {
            // Arrange
            using var db = CreateDbContext(Guid.NewGuid().ToString());
            var authContext = new AuthContext { UserId = null };
            var functions = CreateSut(db, authContext);
            var request = CreateMockRequest();

            // Act
            var response = await functions.Me(request);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task Me_WithUserIdNotInDb_ReturnsUnauthorized()
        {
            // Arrange
            using var db = CreateDbContext(Guid.NewGuid().ToString());
            // No user seeded — userId 999 won't be found
            var authContext = new AuthContext { UserId = 999 };
            var functions = CreateSut(db, authContext);
            var request = CreateMockRequest();

            // Act
            var response = await functions.Me(request);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task Me_WithValidUserId_ReturnsOk()
        {
            // Arrange
            using var db = CreateDbContext(Guid.NewGuid().ToString());
            SeedUser(db, userId: 1);
            var authContext = new AuthContext { UserId = 1 };
            var functions = CreateSut(db, authContext);
            var request = CreateMockRequest();

            // Act
            var response = await functions.Me(request);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        // ── Logout ────────────────────────────────────────────────────────────────

        [Fact]
        public async Task Logout_ReturnsNoContent()
        {
            // Arrange
            using var db = CreateDbContext(Guid.NewGuid().ToString());
            var functions = CreateSut(db);
            var request = CreateMockRequest();

            // Act
            var response = await functions.Logout(request);

            // Assert
            Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        }

        [Fact]
        public async Task Logout_ClearsAuthCookieWithMaxAgeZero()
        {
            // Arrange
            using var db = CreateDbContext(Guid.NewGuid().ToString());
            var functions = CreateSut(db);
            var request = CreateMockRequest();

            // Act
            var response = await functions.Logout(request);

            // Assert — cookie cleared by Max-Age=0
            Assert.True(response.Headers.TryGetValues("Set-Cookie", out var values));
            var cookie = string.Join("", values);
            Assert.Contains("hoops.auth=", cookie);
            Assert.Contains("Max-Age=0", cookie);
        }
    }
}
