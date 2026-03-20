using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;
using Hoops.Functions.Functions;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Moq;
using Xunit;

namespace Hoops.Functions.Tests
{
    public class SponsorFunctionsTest
    {
        private readonly Mock<ISponsorRepository> _mockRepository;
        private readonly Mock<ISeasonService> _mockSeasonService;
        private readonly SponsorFunctions _functions;
        private readonly Mock<FunctionContext> _mockContext;

        public SponsorFunctionsTest()
        {
            _mockRepository = new Mock<ISponsorRepository>();
            _mockSeasonService = new Mock<ISeasonService>();
            _functions = new SponsorFunctions(_mockRepository.Object, _mockSeasonService.Object);
            _mockContext = new Mock<FunctionContext>();
        }

        private HttpRequestData CreateMockRequest()
        {
            var mockRequest = new Mock<HttpRequestData>(_mockContext.Object);
            mockRequest.Setup(r => r.Body).Returns(new MemoryStream());
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

        // ── GetSeasonSponsors ────────────────────────────────────────────────────

        [Fact]
        public async Task GetSeasonSponsors_WithZeroSeasonId_ReturnsBadRequest()
        {
            // Arrange
            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetSeasonSponsors(request, 0);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task GetSeasonSponsors_WithValidSeasonId_ReturnsOk()
        {
            // Arrange
            _mockRepository.Setup(r => r.GetSeasonSponsorsAsync(5)).ReturnsAsync(new List<SponsorWithProfile>());
            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetSeasonSponsors(request, 5);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.GetSeasonSponsorsAsync(5), Times.Once);
        }

        // ── GetCurrentSeasonSponsors ─────────────────────────────────────────────

        [Fact]
        public async Task GetCurrentSeasonSponsors_WhenNoCurrentSeason_ReturnsNotFound()
        {
            // Arrange
            _mockSeasonService.Setup(s => s.GetCurrentSeasonAsync(1)).ReturnsAsync((Season)null!);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetCurrentSeasonSponsors(request);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task GetCurrentSeasonSponsors_WithCurrentSeason_ReturnsOk()
        {
            // Arrange
            var season = new Season { SeasonId = 10, CompanyId = 1 };
            _mockSeasonService.Setup(s => s.GetCurrentSeasonAsync(1)).ReturnsAsync(season);
            _mockRepository.Setup(r => r.GetSeasonSponsorsAsync(10)).ReturnsAsync(new List<SponsorWithProfile>());
            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetCurrentSeasonSponsors(request);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.GetSeasonSponsorsAsync(10), Times.Once);
        }
    }
}
