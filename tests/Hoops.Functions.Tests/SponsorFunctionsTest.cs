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
    public class SponsorFunctionsTest
    {
        private readonly Mock<ISponsorRepository> _mockRepository;
        private readonly Mock<ISeasonService> _mockSeasonService;
        private readonly Mock<ILogger<SponsorFunctions>> _mockLogger;
        private readonly SponsorFunctions _functions;
        private readonly Mock<FunctionContext> _mockContext;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public SponsorFunctionsTest()
        {
            _mockRepository = new Mock<ISponsorRepository>();
            _mockSeasonService = new Mock<ISeasonService>();
            _mockLogger = new Mock<ILogger<SponsorFunctions>>();
            _functions = new SponsorFunctions(_mockRepository.Object, _mockSeasonService.Object, _mockLogger.Object);
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

        // ── GetSeasonSponsors ────────────────────────────────────────────────────

        [Fact]
        public async Task GetSeasonSponsors_WithZeroSeasonId_ReturnsBadRequest()
        {
            var response = await _functions.GetSeasonSponsors(CreateMockRequest(), 0, CancellationToken.None);
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task GetSeasonSponsors_WithValidSeasonId_ReturnsOk()
        {
            _mockRepository.Setup(r => r.GetSeasonSponsorsAsync(5)).ReturnsAsync(new List<SponsorWithProfile>());
            var response = await _functions.GetSeasonSponsors(CreateMockRequest(), 5, CancellationToken.None);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.GetSeasonSponsorsAsync(5), Times.Once);
        }

        // ── GetCurrentSeasonSponsors ─────────────────────────────────────────────

        [Fact]
        public async Task GetCurrentSeasonSponsors_WhenNoCurrentSeason_ReturnsNotFound()
        {
            _mockSeasonService.Setup(s => s.GetCurrentSeasonAsync(1)).ReturnsAsync((Season)null!);
            var response = await _functions.GetCurrentSeasonSponsors(CreateMockRequest(), CancellationToken.None);
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task GetCurrentSeasonSponsors_WithCurrentSeason_ReturnsOk()
        {
            var season = new Season { SeasonId = 10, CompanyId = 1 };
            _mockSeasonService.Setup(s => s.GetCurrentSeasonAsync(1)).ReturnsAsync(season);
            _mockRepository.Setup(r => r.GetSeasonSponsorsAsync(10)).ReturnsAsync(new List<SponsorWithProfile>());
            var response = await _functions.GetCurrentSeasonSponsors(CreateMockRequest(), CancellationToken.None);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.GetSeasonSponsorsAsync(10), Times.Once);
        }

        // ── GetSponsorsByProfile ─────────────────────────────────────────────────

        [Fact]
        public async Task GetSponsorsByProfile_WhenUnauthenticated_ReturnsUnauthorized()
        {
            var response = await _functions.GetSponsorsByProfile(CreateMockRequest(), 1, _mockContext.Object, CancellationToken.None);
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task GetSponsorsByProfile_WhenAuthenticated_ReturnsOk()
        {
            SetAuthenticated();
            _mockRepository.Setup(r => r.GetByProfileIdAsync(3)).ReturnsAsync(new List<SponsorSeasonDto>());
            var response = await _functions.GetSponsorsByProfile(CreateMockRequest(), 3, _mockContext.Object, CancellationToken.None);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.GetByProfileIdAsync(3), Times.Once);
        }

        // ── CreateSponsor ────────────────────────────────────────────────────────

        [Fact]
        public async Task CreateSponsor_WhenUnauthenticated_ReturnsUnauthorized()
        {
            var response = await _functions.CreateSponsor(CreateMockRequest(), _mockContext.Object, CancellationToken.None);
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task CreateSponsor_WithInvalidBody_ReturnsBadRequest()
        {
            SetAuthenticated();
            var response = await _functions.CreateSponsor(CreateMockRequest("not-json"), _mockContext.Object, CancellationToken.None);
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task CreateSponsor_WithValidBody_ReturnsCreated()
        {
            SetAuthenticated();
            var sponsor = new Sponsor { SponsorId = 0, SponsorProfileId = 2, SeasonId = 5 };
            var body = JsonSerializer.Serialize(sponsor, JsonOptions);
            _mockRepository.Setup(r => r.CreateSeasonEntryAsync(It.IsAny<Sponsor>())).ReturnsAsync(sponsor);
            var response = await _functions.CreateSponsor(CreateMockRequest(body), _mockContext.Object, CancellationToken.None);
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        }

        // ── UpdateSponsor ────────────────────────────────────────────────────────

        [Fact]
        public async Task UpdateSponsor_WhenUnauthenticated_ReturnsUnauthorized()
        {
            var response = await _functions.UpdateSponsor(CreateMockRequest(), 1, _mockContext.Object, CancellationToken.None);
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task UpdateSponsor_WithValidBody_ReturnsOk()
        {
            SetAuthenticated();
            var sponsor = new Sponsor { SponsorId = 7, SponsorProfileId = 2, SeasonId = 5 };
            var body = JsonSerializer.Serialize(sponsor, JsonOptions);
            _mockRepository.Setup(r => r.UpdateSeasonEntryAsync(It.IsAny<Sponsor>())).ReturnsAsync(sponsor);
            var response = await _functions.UpdateSponsor(CreateMockRequest(body), 7, _mockContext.Object, CancellationToken.None);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
    }
}
