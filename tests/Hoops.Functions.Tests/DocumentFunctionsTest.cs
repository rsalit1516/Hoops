using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Functions.Functions;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Hoops.Functions.Tests
{
    public class DocumentFunctionsTest
    {
        private readonly Mock<IDocumentStorageService> _mockStorage;
        private readonly Mock<ILogger<DocumentFunctions>> _mockLogger;
        private readonly Mock<IHostEnvironment> _mockEnv;
        private readonly DocumentFunctions _functions;
        private readonly Mock<FunctionContext> _mockContext;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        // Minimal valid PDF bytes (header only — we don't validate PDF content)
        private static readonly byte[] PdfBytes = Encoding.ASCII.GetBytes("%PDF-1.4 minimal-test-content");

        public DocumentFunctionsTest()
        {
            _mockStorage = new Mock<IDocumentStorageService>();
            _mockLogger = new Mock<ILogger<DocumentFunctions>>();
            _mockEnv = new Mock<IHostEnvironment>();
            _mockEnv.Setup(e => e.EnvironmentName).Returns("Development");
            _functions = new DocumentFunctions(_mockStorage.Object, _mockLogger.Object, _mockEnv.Object);
            _mockContext = new Mock<FunctionContext>();

            // Auth: authenticated by default
            SetAuthenticated();

            // FunctionContext.CancellationToken (used when calling the storage service)
            _mockContext.Setup(c => c.CancellationToken).Returns(CancellationToken.None);

            // FunctionDefinition.Name is read by CheckAuthentication when returning 401
            var mockFunctionDef = new Mock<FunctionDefinition>();
            mockFunctionDef.Setup(f => f.Name).Returns("Document_Upload");
            _mockContext.Setup(c => c.FunctionDefinition).Returns(mockFunctionDef.Object);
        }

        // ── Auth ──────────────────────────────────────────────────────────────────

        [Fact]
        public async Task Upload_WhenUnauthenticated_Returns401()
        {
            // Arrange
            SetUnauthenticated();
            var (body, contentType) = BuildMultipartRequest();
            var req = CreateMockRequest(body, contentType);

            // Act
            var response = await _functions.Upload(req, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
            _mockStorage.Verify(
                s => s.UploadDocumentAsync(
                    It.IsAny<Stream>(), It.IsAny<string>(), It.IsAny<string>(),
                    It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(),
                    It.IsAny<int>(), It.IsAny<bool>(), It.IsAny<CancellationToken>()),
                Times.Never);
        }

        // ── Content-Type validation ───────────────────────────────────────────────

        [Fact]
        public async Task Upload_WhenNoContentTypeHeader_Returns400()
        {
            // Arrange — request with no Content-Type at all
            var req = CreateMockRequest(new MemoryStream(), contentType: null);

            // Act
            var response = await _functions.Upload(req, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task Upload_WhenContentTypeIsNotMultipart_Returns400()
        {
            // Arrange
            var req = CreateMockRequest(new MemoryStream(), "application/json");

            // Act
            var response = await _functions.Upload(req, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task Upload_WhenMultipartHasNoBoundary_Returns400()
        {
            // Arrange — Content-Type says multipart but no boundary parameter
            var req = CreateMockRequest(new MemoryStream(), "multipart/form-data");

            // Act
            var response = await _functions.Upload(req, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        // ── Field validation ─────────────────────────────────────────────────────

        [Fact]
        public async Task Upload_WhenFileIsMissing_Returns400WithError()
        {
            // Arrange — form fields present but no file part
            var (body, contentType) = BuildMultipartRequest(
                fields: new Dictionary<string, string>
                {
                    ["title"] = "My Document",
                    ["section"] = "Schedules"
                },
                fileBytes: null);
            var req = CreateMockRequest(body, contentType);

            // Act
            var response = await _functions.Upload(req, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var errors = await ReadErrors(response);
            Assert.Contains(errors, e => e.Contains("file"));
        }

        [Fact]
        public async Task Upload_WhenFileIsNotPdf_Returns400WithError()
        {
            // Arrange
            var (body, contentType) = BuildMultipartRequest(
                fields: new Dictionary<string, string>
                {
                    ["title"] = "My Document",
                    ["section"] = "Schedules"
                },
                fileBytes: Encoding.UTF8.GetBytes("not a pdf"),
                fileName: "document.txt");
            var req = CreateMockRequest(body, contentType);

            // Act
            var response = await _functions.Upload(req, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var errors = await ReadErrors(response);
            Assert.Contains(errors, e => e.Contains("PDF"));
        }

        [Fact]
        public async Task Upload_WhenTitleIsMissing_Returns400WithError()
        {
            // Arrange — file and section present but no title
            var (body, contentType) = BuildMultipartRequest(
                fields: new Dictionary<string, string>
                {
                    ["section"] = "Schedules"
                },
                fileBytes: PdfBytes);
            var req = CreateMockRequest(body, contentType);

            // Act
            var response = await _functions.Upload(req, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var errors = await ReadErrors(response);
            Assert.Contains(errors, e => e.Contains("title"));
        }

        [Fact]
        public async Task Upload_WhenSectionIsMissing_Returns400WithError()
        {
            // Arrange — file and title present but no section
            var (body, contentType) = BuildMultipartRequest(
                fields: new Dictionary<string, string>
                {
                    ["title"] = "My Document"
                },
                fileBytes: PdfBytes);
            var req = CreateMockRequest(body, contentType);

            // Act
            var response = await _functions.Upload(req, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var errors = await ReadErrors(response);
            Assert.Contains(errors, e => e.Contains("section"));
        }

        [Fact]
        public async Task Upload_WhenTitleExceedsMaxLength_Returns400WithError()
        {
            // Arrange
            var (body, contentType) = BuildMultipartRequest(
                fields: new Dictionary<string, string>
                {
                    ["title"] = new string('A', 201),
                    ["section"] = "Schedules"
                },
                fileBytes: PdfBytes);
            var req = CreateMockRequest(body, contentType);

            // Act
            var response = await _functions.Upload(req, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var errors = await ReadErrors(response);
            Assert.Contains(errors, e => e.Contains("200"));
        }

        [Fact]
        public async Task Upload_WhenSectionExceedsMaxLength_Returns400WithError()
        {
            // Arrange
            var (body, contentType) = BuildMultipartRequest(
                fields: new Dictionary<string, string>
                {
                    ["title"] = "My Document",
                    ["section"] = new string('S', 101)
                },
                fileBytes: PdfBytes);
            var req = CreateMockRequest(body, contentType);

            // Act
            var response = await _functions.Upload(req, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var errors = await ReadErrors(response);
            Assert.Contains(errors, e => e.Contains("100"));
        }

        [Fact]
        public async Task Upload_WhenMultipleFieldsMissing_Returns400WithMultipleErrors()
        {
            // Arrange — file present but both title and section missing
            var (body, contentType) = BuildMultipartRequest(fileBytes: PdfBytes);
            var req = CreateMockRequest(body, contentType);

            // Act
            var response = await _functions.Upload(req, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
            var errors = await ReadErrors(response);
            Assert.True(errors.Count >= 2, "Expected at least 2 validation errors");
        }

        // ── Happy path ────────────────────────────────────────────────────────────

        [Fact]
        public async Task Upload_WithValidRequest_Returns201WithMetadata()
        {
            // Arrange
            var expectedMetadata = new DocumentMetadata
            {
                DocumentId = "abc-123",
                Title = "Schedule 2024",
                Section = "Schedules",
                BlobPath = "schedules/abc-123.pdf",
                BlobUrl = "https://hoopsstoragedev.blob.core.windows.net/documents/schedules/abc-123.pdf",
                SortOrder = 5,
                Description = "Fall season schedule",
                Season = "2024-25",
                IsActive = true,
                LastUpdatedUtc = System.DateTime.UtcNow
            };

            _mockStorage
                .Setup(s => s.UploadDocumentAsync(
                    It.IsAny<Stream>(), "schedule.pdf", "Schedule 2024", "Schedules",
                    "Fall season schedule", "2024-25", 5, true, It.IsAny<CancellationToken>()))
                .ReturnsAsync(expectedMetadata);

            var (body, contentType) = BuildMultipartRequest(
                fields: new Dictionary<string, string>
                {
                    ["title"] = "Schedule 2024",
                    ["section"] = "Schedules",
                    ["description"] = "Fall season schedule",
                    ["season"] = "2024-25",
                    ["sortOrder"] = "5",
                    ["isActive"] = "true"
                },
                fileBytes: PdfBytes,
                fileName: "schedule.pdf");
            var req = CreateMockRequest(body, contentType);

            // Act
            var response = await _functions.Upload(req, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            _mockStorage.Verify(
                s => s.UploadDocumentAsync(
                    It.IsAny<Stream>(), "schedule.pdf", "Schedule 2024", "Schedules",
                    "Fall season schedule", "2024-25", 5, true, It.IsAny<CancellationToken>()),
                Times.Once);
        }

        [Fact]
        public async Task Upload_WithOnlyRequiredFields_Returns201()
        {
            // Arrange — minimal required fields only
            _mockStorage
                .Setup(s => s.UploadDocumentAsync(
                    It.IsAny<Stream>(), It.IsAny<string>(), "Minimal Doc", "Rules",
                    null, null, 0, true, It.IsAny<CancellationToken>()))
                .ReturnsAsync(new DocumentMetadata
                {
                    DocumentId = "xyz-456",
                    Title = "Minimal Doc",
                    Section = "Rules"
                });

            var (body, contentType) = BuildMultipartRequest(
                fields: new Dictionary<string, string>
                {
                    ["title"] = "Minimal Doc",
                    ["section"] = "Rules"
                },
                fileBytes: PdfBytes);
            var req = CreateMockRequest(body, contentType);

            // Act
            var response = await _functions.Upload(req, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        }

        // ── Service error ─────────────────────────────────────────────────────────

        [Fact]
        public async Task Upload_WhenStorageServiceThrows_Returns500()
        {
            // Arrange
            _mockStorage
                .Setup(s => s.UploadDocumentAsync(
                    It.IsAny<Stream>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(),
                    It.IsAny<string>(), It.IsAny<string>(), It.IsAny<int>(), It.IsAny<bool>(),
                    It.IsAny<CancellationToken>()))
                .ThrowsAsync(new System.Exception("Storage unavailable"));

            var (body, contentType) = BuildMultipartRequest(
                fields: new Dictionary<string, string>
                {
                    ["title"] = "Doc",
                    ["section"] = "Forms"
                },
                fileBytes: PdfBytes);
            var req = CreateMockRequest(body, contentType);

            // Act
            var response = await _functions.Upload(req, _mockContext.Object);

            // Assert
            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        }

        // ── Helpers ───────────────────────────────────────────────────────────────

        private void SetAuthenticated()
        {
            var items = new Dictionary<object, object> { ["User"] = new { UserId = 1 } };
            _mockContext.Setup(c => c.Items).Returns(items);
        }

        private void SetUnauthenticated()
        {
            _mockContext.Setup(c => c.Items).Returns(new Dictionary<object, object>());
        }

        private HttpRequestData CreateMockRequest(Stream body, string? contentType)
        {
            var mockRequest = new Mock<HttpRequestData>(_mockContext.Object);

            mockRequest.Setup(r => r.Body).Returns(body);

            var headers = new HttpHeadersCollection();
            if (contentType != null)
                headers.Add("Content-Type", contentType);
            mockRequest.Setup(r => r.Headers).Returns(headers);

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

        /// <summary>
        /// Builds a multipart/form-data body stream and the corresponding Content-Type header value.
        /// </summary>
        private static (MemoryStream body, string contentType) BuildMultipartRequest(
            Dictionary<string, string>? fields = null,
            byte[]? fileBytes = null,
            string fileName = "test.pdf")
        {
            const string boundary = "TestBoundary00000000001";
            var ms = new MemoryStream();

            void WriteText(string s) => ms.Write(Encoding.UTF8.GetBytes(s));
            void WriteRaw(byte[] b) => ms.Write(b, 0, b.Length);

            if (fields != null)
            {
                foreach (var kvp in fields)
                {
                    WriteText($"--{boundary}\r\n");
                    WriteText($"Content-Disposition: form-data; name=\"{kvp.Key}\"\r\n\r\n");
                    WriteText(kvp.Value);
                    WriteText("\r\n");
                }
            }

            if (fileBytes != null)
            {
                WriteText($"--{boundary}\r\n");
                WriteText($"Content-Disposition: form-data; name=\"file\"; filename=\"{fileName}\"\r\n");
                WriteText("Content-Type: application/pdf\r\n\r\n");
                WriteRaw(fileBytes);
                WriteText("\r\n");
            }

            WriteText($"--{boundary}--\r\n");
            ms.Position = 0;

            return (ms, $"multipart/form-data; boundary={boundary}");
        }

        /// <summary>Deserializes the { errors: [...] } body from a 400 response.</summary>
        private static async Task<List<string>> ReadErrors(HttpResponseData response)
        {
            response.Body.Position = 0;
            using var doc = await JsonDocument.ParseAsync(response.Body);

            var list = new List<string>();
            if (doc.RootElement.TryGetProperty("errors", out var arr))
            {
                foreach (var item in arr.EnumerateArray())
                    list.Add(item.GetString() ?? string.Empty);
            }
            return list;
        }
    }
}
