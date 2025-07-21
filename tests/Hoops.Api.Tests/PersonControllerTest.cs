using Moq;
using Microsoft.Extensions.Logging;
using Hoops.Controllers;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace Hoops.Api.Tests
{
    public class PersonControllerTest
    {

        [Fact]
        public void Search_ReturnsOkResult_WithMatchingPeople()
        {
            // Arrange
            var mockRepo = new Mock<IPersonRepository>();
            var mockLogger = new Mock<ILogger<PersonController>>();
            var expectedPeople = new List<Person>
        {
            new Person { FirstName = "Jane", LastName = "Smith", Player = true }
        };

            mockRepo.Setup(r => r.FindPeopleByLastAndFirstName("Smith", "Jane", true))
                    .Returns((IQueryable<Person>)expectedPeople);

            var controller = new PersonController(mockRepo.Object, mockLogger.Object);

            // Act
            var result = controller.Search("Smith", "Jane", true);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var people = Assert.IsAssignableFrom<IEnumerable<Person>>(okResult.Value);
            Assert.Single(people);
        }
    }
}