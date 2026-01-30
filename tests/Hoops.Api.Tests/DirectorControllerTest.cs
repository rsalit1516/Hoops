using Moq;
using Hoops.Controllers;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace Hoops.Api.Tests
{
    public class DirectorControllerTest
    {
        [Fact]
        public void Get_ReturnsOkResult_WithAllDirectors()
        {
            // Arrange
            var mockRepo = new Mock<IDirectorRepository>();
            var expectedDirectors = new List<VwDirector>
            {
                new VwDirector { DirectorId = 1, Name = "Smith, John", Title = "President" },
                new VwDirector { DirectorId = 2, Name = "Doe, Jane", Title = "Vice President" }
            };

            mockRepo.Setup(r => r.GetAll(1))
                    .Returns(expectedDirectors);

            var controller = new DirectorController(mockRepo.Object);

            // Act
            var result = controller.Get();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var directors = Assert.IsAssignableFrom<IEnumerable<VwDirector>>(okResult.Value);
            Assert.Equal(2, directors.Count());
        }

        [Fact]
        public void GetDirectorVolunteers_ReturnsOkResult_WithEligiblePeople()
        {
            // Arrange
            var mockRepo = new Mock<IDirectorRepository>();
            var expectedVolunteers = new List<VwDirector>
            {
                new VwDirector { PersonId = 1, Name = "Smith, John" },
                new VwDirector { PersonId = 2, Name = "Doe, Jane" },
                new VwDirector { PersonId = 3, Name = "Brown, Bob" }
            };

            mockRepo.Setup(r => r.GetDirectorVolunteers(1))
                    .Returns(expectedVolunteers);

            var controller = new DirectorController(mockRepo.Object);

            // Act
            var result = controller.GetDirectorVolunteers();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var volunteers = Assert.IsAssignableFrom<IEnumerable<VwDirector>>(okResult.Value);
            Assert.Equal(3, volunteers.Count());
        }

        [Fact]
        public void GetDirectorVolunteers_ReturnsOkResult_WithEmptyList_WhenNoVolunteers()
        {
            // Arrange
            var mockRepo = new Mock<IDirectorRepository>();
            var expectedVolunteers = new List<VwDirector>();

            mockRepo.Setup(r => r.GetDirectorVolunteers(1))
                    .Returns(expectedVolunteers);

            var controller = new DirectorController(mockRepo.Object);

            // Act
            var result = controller.GetDirectorVolunteers();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var volunteers = Assert.IsAssignableFrom<IEnumerable<VwDirector>>(okResult.Value);
            Assert.Empty(volunteers);
        }

        [Fact]
        public void GetDirector_ReturnsOkResult_WhenDirectorExists()
        {
            // Arrange
            var mockRepo = new Mock<IDirectorRepository>();
            var expectedDirector = new Director { DirectorId = 1, PersonId = 100, Title = "President" };

            mockRepo.Setup(r => r.GetById(1))
                    .Returns(expectedDirector);

            var controller = new DirectorController(mockRepo.Object);

            // Act
            var result = controller.GetDirector(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var director = Assert.IsType<Director>(okResult.Value);
            Assert.Equal(1, director.DirectorId);
            Assert.Equal("President", director.Title);
        }

        [Fact]
        public void GetDirector_ReturnsNotFound_WhenDirectorDoesNotExist()
        {
            // Arrange
            var mockRepo = new Mock<IDirectorRepository>();
            mockRepo.Setup(r => r.GetById(999))
                    .Returns((Director)null!);

            var controller = new DirectorController(mockRepo.Object);

            // Act
            var result = controller.GetDirector(999);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public void PostDirector_ReturnsOkResult_WithCreatedDirector()
        {
            // Arrange
            var mockRepo = new Mock<IDirectorRepository>();
            var newDirector = new Director { PersonId = 100, Title = "Treasurer", CompanyId = 1 };
            var createdDirector = new Director { DirectorId = 1, PersonId = 100, Title = "Treasurer", CompanyId = 1 };

            mockRepo.Setup(r => r.Insert(It.IsAny<Director>()))
                    .Returns(createdDirector);
            mockRepo.Setup(r => r.SaveChanges());

            var controller = new DirectorController(mockRepo.Object);

            // Act
            var result = controller.PostDirector(newDirector);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var director = Assert.IsType<Director>(okResult.Value);
            Assert.Equal(1, director.DirectorId);
            Assert.Equal("Treasurer", director.Title);
            mockRepo.Verify(r => r.SaveChanges(), Times.Once);
        }

        [Fact]
        public void PutDirector_ReturnsOkResult_WhenUpdateSucceeds()
        {
            // Arrange
            var mockRepo = new Mock<IDirectorRepository>();
            var existingDirector = new Director { DirectorId = 1, PersonId = 100, Title = "President" };
            var updatedDirector = new Director { DirectorId = 1, PersonId = 100, Title = "Chairman" };

            mockRepo.Setup(r => r.Update(It.IsAny<Director>()))
                    .Returns(updatedDirector);
            mockRepo.Setup(r => r.SaveChanges());

            var controller = new DirectorController(mockRepo.Object);

            // Act
            var result = controller.PutDirector(1, updatedDirector);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var director = Assert.IsType<Director>(okResult.Value);
            Assert.Equal("Chairman", director.Title);
            mockRepo.Verify(r => r.SaveChanges(), Times.Once);
        }

        [Fact]
        public void PutDirector_ReturnsBadRequest_WhenIdMismatch()
        {
            // Arrange
            var mockRepo = new Mock<IDirectorRepository>();
            var updatedDirector = new Director { DirectorId = 2, PersonId = 100, Title = "Chairman" };

            var controller = new DirectorController(mockRepo.Object);

            // Act
            var result = controller.PutDirector(1, updatedDirector);

            // Assert
            Assert.IsType<BadRequestResult>(result.Result);
            mockRepo.Verify(r => r.Update(It.IsAny<Director>()), Times.Never);
        }

        [Fact]
        public void DeleteDirector_ReturnsOkResult_WhenDirectorExists()
        {
            // Arrange
            var mockRepo = new Mock<IDirectorRepository>();
            var directorToDelete = new Director { DirectorId = 1, PersonId = 100, Title = "President" };

            mockRepo.Setup(r => r.GetById(1))
                    .Returns(directorToDelete);
            mockRepo.Setup(r => r.Delete(It.IsAny<Director>()));
            mockRepo.Setup(r => r.SaveChanges());

            var controller = new DirectorController(mockRepo.Object);

            // Act
            var result = controller.DeleteDirector(1);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var director = Assert.IsType<Director>(okResult.Value);
            Assert.Equal(1, director.DirectorId);
            mockRepo.Verify(r => r.Delete(directorToDelete), Times.Once);
            mockRepo.Verify(r => r.SaveChanges(), Times.Once);
        }

        [Fact]
        public void DeleteDirector_ReturnsNotFound_WhenDirectorDoesNotExist()
        {
            // Arrange
            var mockRepo = new Mock<IDirectorRepository>();
            mockRepo.Setup(r => r.GetById(999))
                    .Returns((Director)null!);

            var controller = new DirectorController(mockRepo.Object);

            // Act
            var result = controller.DeleteDirector(999);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
            mockRepo.Verify(r => r.Delete(It.IsAny<Director>()), Times.Never);
        }
    }
}
