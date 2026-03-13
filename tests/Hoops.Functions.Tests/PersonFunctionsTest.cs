using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Functions.Functions;
using Hoops.Functions.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Moq;
using Xunit;

namespace Hoops.Functions.Tests
{
    public class PersonFunctionsTest
    {
        private readonly Mock<IPersonRepository> _mockRepository;
        private readonly PersonFunctions _functions;
        private readonly Mock<FunctionContext> _mockContext;

        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public PersonFunctionsTest()
        {
            _mockRepository = new Mock<IPersonRepository>();
            _functions = new PersonFunctions(_mockRepository.Object);
            _mockContext = new Mock<FunctionContext>();
        }

        private HttpRequestData CreateMockRequest(string body = "", string url = "http://localhost/api/Person")
        {
            var mockRequest = new Mock<HttpRequestData>(_mockContext.Object);
            var bodyStream = new MemoryStream(Encoding.UTF8.GetBytes(body));

            mockRequest.Setup(r => r.Body).Returns(bodyStream);
            mockRequest.Setup(r => r.Url).Returns(new System.Uri(url));
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

        // ── GetPeople ────────────────────────────────────────────────────────────

        [Fact]
        public async Task GetPeople_ReturnsOkWithList()
        {
            // Arrange
            var people = new List<Person>
            {
                new Person { PersonId = 1, FirstName = "Alice", LastName = "Smith" },
                new Person { PersonId = 2, FirstName = "Bob", LastName = "Jones" }
            };
            _mockRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(people);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.GetPeople(request);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.GetAllAsync(), Times.Once);
        }

        // ── GetADs ───────────────────────────────────────────────────────────────

        [Fact]
        public void GetADs_ReturnsOk()
        {
            // Arrange
            _mockRepository.Setup(r => r.GetADs(1)).Returns(new List<Person>().AsQueryable());
            var request = CreateMockRequest();

            // Act
            var response = _functions.GetADs(request);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        // ── GetHouseholdMembers ──────────────────────────────────────────────────

        [Fact]
        public void GetHouseholdMembers_ReturnsOkWithList()
        {
            // Arrange
            var people = new List<Person> { new Person { PersonId = 1, FirstName = "Alice" } };
            _mockRepository.Setup(r => r.GetByHousehold(5)).Returns(people);
            var request = CreateMockRequest();

            // Act
            var response = _functions.GetHouseholdMembers(request, 5);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        // ── PostPerson ───────────────────────────────────────────────────────────

        [Fact]
        public async Task PostPerson_WithNullBody_ReturnsBadRequest()
        {
            // Arrange
            var request = CreateMockRequest("null");

            // Act
            var response = await _functions.PostPerson(request);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task PostPerson_WithValidBody_ReturnsCreated()
        {
            // Arrange
            var dto = new PersonDto { PersonId = 0, FirstName = "Alice", LastName = "Smith", CompanyId = 1 };
            var created = new Person { PersonId = 1, FirstName = "Alice", LastName = "Smith", CompanyId = 1 };
            _mockRepository.Setup(r => r.Insert(It.IsAny<Person>())).Returns(created);
            _mockRepository.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var request = CreateMockRequest(JsonSerializer.Serialize(dto, JsonOptions));

            // Act
            var response = await _functions.PostPerson(request);

            // Assert
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            _mockRepository.Verify(r => r.Insert(It.IsAny<Person>()), Times.Once);
        }

        // ── PutPerson ────────────────────────────────────────────────────────────

        [Fact]
        public async Task PutPerson_WithNullBody_ReturnsBadRequest()
        {
            // Arrange
            var request = CreateMockRequest("null");

            // Act
            var response = await _functions.PutPerson(request, 1);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task PutPerson_WithMismatchedId_ReturnsBadRequest()
        {
            // Arrange
            var dto = new PersonDto { PersonId = 2, FirstName = "Alice" };
            var request = CreateMockRequest(JsonSerializer.Serialize(dto, JsonOptions));

            // Act
            var response = await _functions.PutPerson(request, 1);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task PutPerson_WithValidData_ReturnsOk()
        {
            // Arrange
            var dto = new PersonDto { PersonId = 1, FirstName = "Alice", LastName = "Updated" };
            var updated = new Person { PersonId = 1, FirstName = "Alice", LastName = "Updated" };
            _mockRepository.Setup(r => r.Update(It.IsAny<Person>())).Returns(updated);
            _mockRepository.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var request = CreateMockRequest(JsonSerializer.Serialize(dto, JsonOptions));

            // Act
            var response = await _functions.PutPerson(request, 1);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        // ── DeletePerson ─────────────────────────────────────────────────────────

        [Fact]
        public async Task DeletePerson_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            _mockRepository.Setup(r => r.FindByAsync(999)).ReturnsAsync((Person)null!);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.DeletePerson(request, 999);

            // Assert
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task DeletePerson_WithValidId_ReturnsOk()
        {
            // Arrange
            var person = new Person { PersonId = 1, FirstName = "Alice", LastName = "Smith" };
            _mockRepository.Setup(r => r.FindByAsync(1)).ReturnsAsync(person);
            _mockRepository.Setup(r => r.Delete(person));
            _mockRepository.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);
            var request = CreateMockRequest();

            // Act
            var response = await _functions.DeletePerson(request, 1);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            _mockRepository.Verify(r => r.Delete(person), Times.Once);
        }
    }
}
