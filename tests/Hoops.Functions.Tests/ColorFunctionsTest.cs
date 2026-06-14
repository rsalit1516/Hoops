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
    public class ColorFunctionsTest
    {
        private const int CompanyId = 1;

        private readonly Mock<IColorRepository> _mockRepository;
        private readonly Mock<ILogger<ColorFunctions>> _mockLogger;
        private readonly ColorFunctions _functions;
        private readonly Mock<FunctionContext> _mockContext;

        public ColorFunctionsTest()
        {
            _mockRepository = new Mock<IColorRepository>();
            _mockLogger = new Mock<ILogger<ColorFunctions>>();
            _functions = new ColorFunctions(_mockRepository.Object, _mockLogger.Object);
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
        public async Task Get_ReturnsOk_WithActiveColorsOnly()
        {
            var colors = new List<Color>
            {
                new Color { ColorId = 1, ColorName = "Red", Discontinued = false, CompanyId = CompanyId },
                new Color { ColorId = 2, ColorName = "Blue", Discontinued = false, CompanyId = CompanyId },
                new Color { ColorId = 3, ColorName = "Green", Discontinued = true, CompanyId = CompanyId }
            };
            _mockRepository.Setup(r => r.GetAll(CompanyId)).Returns(colors);
            var request = CreateMockRequest();

            var response = await _functions.Get(request);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.GetAll(CompanyId), Times.Once);
        }

        [Fact]
        public async Task Get_FiltersOutDiscontinuedColors()
        {
            var colors = new List<Color>
            {
                new Color { ColorId = 1, ColorName = "Red", Discontinued = false, CompanyId = CompanyId },
                new Color { ColorId = 2, ColorName = "Blue", Discontinued = true, CompanyId = CompanyId }
            };
            _mockRepository.Setup(r => r.GetAll(CompanyId)).Returns(colors);
            var request = CreateMockRequest();

            var response = await _functions.Get(request);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
    }
}
