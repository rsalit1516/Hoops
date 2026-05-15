using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading;
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
    public class SponsorProfileFunctionsTest
    {
        private readonly Mock<ISponsorProfileRepository> _mockRepository;
        private readonly Mock<ILogger<SponsorProfileFunctions>> _mockLogger;
        private readonly SponsorProfileFunctions _functions;
        private readonly Mock<FunctionContext> _mockContext;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public SponsorProfileFunctionsTest()
        {
            _mockRepository = new Mock<ISponsorProfileRepository>();
            _mockLogger = new Mock<ILogger<SponsorProfileFunctions>>();
            _functions = new SponsorProfileFunctions(_mockRepository.Object, _mockLogger.Object);
            _mockContext = new Mock<FunctionContext>();

            _mockContext.Setup(c => c.Items).Returns(new Dictionary<object, object>());
            var mockFunctionDef = new Mock<FunctionDefinition>();
            mockFunctionDef.Setup(f => f.Name).Returns("TestFunction");
            _mockContext.Setup(c => c.FunctionDefinition).Returns(mockFunctionDef.Object);
        }

        private HttpRequestData CreateMockRequest(string body = "")
        {
            var mockRequest = new Mock<HttpRequestData>(_mockContext.Object);
            mockRequest.Setup(r => r.Body).Returns(new MemoryStream(Encoding.UTF8.GetBytes(body)));
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

        // ── GetSponsorProfiles ───────────────────────────────────────────────────

        [Fact]
        public async Task GetSponsorProfiles_WhenUnauthenticated_ReturnsUnauthorized()
        {
            var response = await _functions.GetSponsorProfiles(CreateMockRequest(), _mockContext.Object, CancellationToken.None);
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task GetSponsorProfiles_WhenAuthenticated_ReturnsOk()
        {
            SetAuthenticated();
            _mockRepository.Setup(r => r.GetAllWithLastSeasonAsync(1)).ReturnsAsync(new List<SponsorProfileListItemDto>());
            var response = await _functions.GetSponsorProfiles(CreateMockRequest(), _mockContext.Object, CancellationToken.None);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        // ── GetSponsorProfileById ────────────────────────────────────────────────

        [Fact]
        public async Task GetSponsorProfileById_WhenUnauthenticated_ReturnsUnauthorized()
        {
            var response = await _functions.GetSponsorProfileById(CreateMockRequest(), 1, _mockContext.Object, CancellationToken.None);
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task GetSponsorProfileById_WhenNotFound_ReturnsNotFound()
        {
            SetAuthenticated();
            _mockRepository.Setup(r => r.GetDetailByIdAsync(99)).ReturnsAsync((SponsorProfileDetailDto?)null);
            var response = await _functions.GetSponsorProfileById(CreateMockRequest(), 99, _mockContext.Object, CancellationToken.None);
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task GetSponsorProfileById_WhenFound_ReturnsOk()
        {
            SetAuthenticated();
            var dto = new SponsorProfileDetailDto { SponsorProfileId = 5, SpoName = "Acme Corp" };
            _mockRepository.Setup(r => r.GetDetailByIdAsync(5)).ReturnsAsync(dto);
            var response = await _functions.GetSponsorProfileById(CreateMockRequest(), 5, _mockContext.Object, CancellationToken.None);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        // ── CreateSponsorProfile ─────────────────────────────────────────────────

        [Fact]
        public async Task CreateSponsorProfile_WhenUnauthenticated_ReturnsUnauthorized()
        {
            var response = await _functions.CreateSponsorProfile(CreateMockRequest(), _mockContext.Object, CancellationToken.None);
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task CreateSponsorProfile_WithInvalidBody_ReturnsBadRequest()
        {
            SetAuthenticated();
            var response = await _functions.CreateSponsorProfile(CreateMockRequest("not-json"), _mockContext.Object, CancellationToken.None);
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task CreateSponsorProfile_WithValidBody_ReturnsCreated()
        {
            SetAuthenticated();
            var profile = new SponsorProfile { SponsorProfileId = 0, SpoName = "New Sponsor", CompanyId = 1 };
            var body = JsonSerializer.Serialize(profile, JsonOptions);
            _mockRepository.Setup(r => r.CreateProfileAsync(It.IsAny<SponsorProfile>())).ReturnsAsync(profile);
            var response = await _functions.CreateSponsorProfile(CreateMockRequest(body), _mockContext.Object, CancellationToken.None);
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        }

        // ── UpdateSponsorProfile ─────────────────────────────────────────────────

        [Fact]
        public async Task UpdateSponsorProfile_WhenUnauthenticated_ReturnsUnauthorized()
        {
            var response = await _functions.UpdateSponsorProfile(CreateMockRequest(), 1, _mockContext.Object, CancellationToken.None);
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task UpdateSponsorProfile_WithValidBody_ReturnsOk()
        {
            SetAuthenticated();
            var profile = new SponsorProfile { SponsorProfileId = 3, SpoName = "Updated Sponsor", CompanyId = 1 };
            var body = JsonSerializer.Serialize(profile, JsonOptions);
            _mockRepository.Setup(r => r.UpdateProfileAsync(It.IsAny<SponsorProfile>())).ReturnsAsync(profile);
            var response = await _functions.UpdateSponsorProfile(CreateMockRequest(body), 3, _mockContext.Object, CancellationToken.None);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
    }
}
