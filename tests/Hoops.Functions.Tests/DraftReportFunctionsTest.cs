using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
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
    public class DraftReportFunctionsTest
    {
        private readonly Mock<IPlayerRepository> _mockRepository;
        private readonly Mock<ILogger<DraftReportFunctions>> _mockLogger;
        private readonly DraftReportFunctions _functions;
        private readonly Mock<FunctionContext> _mockContext;

        public DraftReportFunctionsTest()
        {
            _mockRepository = new Mock<IPlayerRepository>();
            _mockLogger = new Mock<ILogger<DraftReportFunctions>>();
            _functions = new DraftReportFunctions(_mockRepository.Object, _mockLogger.Object);
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
        public async Task GetDraftReport_WithSeasonOnly_ReturnsOk()
        {
            // Arrange
            _mockRepository.Setup(r => r.GetDraftReportPlayers(1, null)).Returns(new List<DraftReportPlayer>());
            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetDraftReport(request, 1);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.GetDraftReportPlayers(1, null), Times.Once);
        }

        [Fact]
        public async Task GetDraftReport_WithSeasonAndDivision_ReturnsOk()
        {
            // Arrange
            _mockRepository.Setup(r => r.GetDraftReportPlayers(2, 5)).Returns(new List<DraftReportPlayer>());
            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetDraftReport(request, 2, 5);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.GetDraftReportPlayers(2, 5), Times.Once);
        }

        [Fact]
        public async Task GetDraftReport_WhenRepositoryThrows_ReturnsInternalServerError()
        {
            // Arrange
            _mockRepository
                .Setup(r => r.GetDraftReportPlayers(It.IsAny<int>(), It.IsAny<int?>()))
                .Throws(new Exception("DB connection failed"));
            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetDraftReport(request, 1);

            // Assert
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        }
    }
}
