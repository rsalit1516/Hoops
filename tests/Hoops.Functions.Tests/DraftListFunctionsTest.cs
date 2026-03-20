using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Functions.Functions;
// DraftListPlayer is in Hoops.Core.Models
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Hoops.Functions.Tests
{
    public class DraftListFunctionsTest
    {
        private readonly Mock<IPlayerRepository> _mockRepository;
        private readonly Mock<ILogger<DraftListFunctions>> _mockLogger;
        private readonly DraftListFunctions _functions;
        private readonly Mock<FunctionContext> _mockContext;

        public DraftListFunctionsTest()
        {
            _mockRepository = new Mock<IPlayerRepository>();
            _mockLogger = new Mock<ILogger<DraftListFunctions>>();
            _functions = new DraftListFunctions(_mockRepository.Object, _mockLogger.Object);
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

        [Fact]
        public async Task GetDraftList_WithValidSeasonId_ReturnsOk()
        {
            // Arrange
            _mockRepository.Setup(r => r.GetDraftListPlayers(1, null)).Returns(new List<DraftListPlayer>());
            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetDraftList(request, 1);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.GetDraftListPlayers(1, null), Times.Once);
        }

        [Fact]
        public async Task GetDraftList_WithSeasonAndDivision_ReturnsOk()
        {
            // Arrange
            _mockRepository.Setup(r => r.GetDraftListPlayers(2, 5)).Returns(new List<DraftListPlayer>());
            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetDraftList(request, 2, 5);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.GetDraftListPlayers(2, 5), Times.Once);
        }
    }
}
