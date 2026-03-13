using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Functions.Functions;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Moq;
using Xunit;

namespace Hoops.Functions.Tests
{
    public class ColorFunctionsTest
    {
        private readonly Mock<IColorRepository> _mockRepository;
        private readonly ColorFunctions _functions;
        private readonly Mock<FunctionContext> _mockContext;

        public ColorFunctionsTest()
        {
            _mockRepository = new Mock<IColorRepository>();
            _functions = new ColorFunctions(_mockRepository.Object);
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
        public async Task Get_ReturnsOkWithActiveColors()
        {
            // Arrange
            var colors = new List<Color>
            {
                new Color { ColorId = 1, ColorName = "Red", Discontinued = false },
                new Color { ColorId = 2, ColorName = "Blue", Discontinued = false },
                new Color { ColorId = 3, ColorName = "Green", Discontinued = true }
            };
            _mockRepository.Setup(r => r.GetAll()).Returns(colors);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.Get(request);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.GetAll(), Times.Once);
        }
    }
}
