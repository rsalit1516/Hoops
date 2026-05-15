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
    public class SponsorPaymentFunctionsTest
    {
        private readonly Mock<ISponsorPaymentRepository> _mockRepository;
        private readonly Mock<ILogger<SponsorPaymentFunctions>> _mockLogger;
        private readonly SponsorPaymentFunctions _functions;
        private readonly Mock<FunctionContext> _mockContext;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public SponsorPaymentFunctionsTest()
        {
            _mockRepository = new Mock<ISponsorPaymentRepository>();
            _mockLogger = new Mock<ILogger<SponsorPaymentFunctions>>();
            _functions = new SponsorPaymentFunctions(_mockRepository.Object, _mockLogger.Object);
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

        // ── GetPaymentsByProfile ─────────────────────────────────────────────────

        [Fact]
        public async Task GetPaymentsByProfile_WhenUnauthenticated_ReturnsUnauthorized()
        {
            var response = await _functions.GetPaymentsByProfile(CreateMockRequest(), 1, _mockContext.Object, CancellationToken.None);
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task GetPaymentsByProfile_WhenAuthenticated_ReturnsOk()
        {
            SetAuthenticated();
            _mockRepository.Setup(r => r.GetPaymentsAsync(2)).ReturnsAsync(new List<SponsorPaymentDto>());
            var response = await _functions.GetPaymentsByProfile(CreateMockRequest(), 2, _mockContext.Object, CancellationToken.None);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.GetPaymentsAsync(2), Times.Once);
        }

        // ── CreatePayment ────────────────────────────────────────────────────────

        [Fact]
        public async Task CreatePayment_WhenUnauthenticated_ReturnsUnauthorized()
        {
            var response = await _functions.CreatePayment(CreateMockRequest(), _mockContext.Object, CancellationToken.None);
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task CreatePayment_WithInvalidBody_ReturnsBadRequest()
        {
            SetAuthenticated();
            var response = await _functions.CreatePayment(CreateMockRequest("not-json"), _mockContext.Object, CancellationToken.None);
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task CreatePayment_WithValidBody_ReturnsCreated()
        {
            SetAuthenticated();
            var payment = new SponsorPayment { PaymentId = 0, SponsorProfileId = 2, Amount = 225m };
            var body = JsonSerializer.Serialize(payment, JsonOptions);
            _mockRepository.Setup(r => r.AddPaymentAsync(It.IsAny<SponsorPayment>())).ReturnsAsync(payment);
            var response = await _functions.CreatePayment(CreateMockRequest(body), _mockContext.Object, CancellationToken.None);
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        }

        // ── UpdatePayment ────────────────────────────────────────────────────────

        [Fact]
        public async Task UpdatePayment_WhenUnauthenticated_ReturnsUnauthorized()
        {
            var response = await _functions.UpdatePayment(CreateMockRequest(), 1, _mockContext.Object, CancellationToken.None);
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task UpdatePayment_WithInvalidBody_ReturnsBadRequest()
        {
            SetAuthenticated();
            var response = await _functions.UpdatePayment(CreateMockRequest("not-json"), 1, _mockContext.Object, CancellationToken.None);
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task UpdatePayment_WithValidBody_ReturnsOk()
        {
            SetAuthenticated();
            var payment = new SponsorPayment { PaymentId = 4, SponsorProfileId = 2, Amount = 112.50m };
            var body = JsonSerializer.Serialize(payment, JsonOptions);
            _mockRepository.Setup(r => r.UpdatePaymentAsync(It.IsAny<SponsorPayment>())).ReturnsAsync(payment);
            var response = await _functions.UpdatePayment(CreateMockRequest(body), 4, _mockContext.Object, CancellationToken.None);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
    }
}
