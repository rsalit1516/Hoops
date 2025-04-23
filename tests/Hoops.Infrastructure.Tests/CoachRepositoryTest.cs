using System.Collections.Generic;
using System.Linq;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace Hoops.Infrastructure.Tests
{
    public class CoachRepositoryTest
    {
        private readonly Mock<hoopsContext> _mockContext;
        private readonly Mock<DbSet<Coach>> _mockSet;
        private readonly CoachRepository _repository;

        public CoachRepositoryTest()
        {
            _mockContext = new Mock<hoopsContext>();
            _mockSet = new Mock<DbSet<Coach>>();
            _mockContext.Setup(m => m.Set<Coach>()).Returns(_mockSet.Object);
            _repository = new CoachRepository(_mockContext.Object);
        }

        [Fact]
        public void GetSeasonCoaches_ReturnsCorrectCoaches()
        {
            // Arrange
            var coaches = new List<Coach>
            {
                new Coach { CoachId = 1, SeasonId = 1, PersonId = 1, Person = new Person { FirstName = "John", LastName = "Doe" } },
                new Coach { CoachId = 2, SeasonId = 1, PersonId = 2, Person = new Person { FirstName = "Jane", LastName = "Smith" } }
            }.AsQueryable();

            _mockSet.As<IQueryable<Coach>>().Setup(m => m.Provider).Returns(coaches.Provider);
            _mockSet.As<IQueryable<Coach>>().Setup(m => m.Expression).Returns(coaches.Expression);
            _mockSet.As<IQueryable<Coach>>().Setup(m => m.ElementType).Returns(coaches.ElementType);
            _mockSet.As<IQueryable<Coach>>().Setup(m => m.GetEnumerator()).Returns(coaches.GetEnumerator());

            // Act
            var result = _repository.GetSeasonCoaches(1).ToList();

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Equal("Doe, John", result[0].Name);
            Assert.Equal("Smith, Jane", result[1].Name);
        }

        [Fact]
        public void GetCoach_ReturnsCorrectCoach()
        {
            // Arrange
            var coach = new Coach { CoachId = 1, PersonId = 1, Person = new Person { FirstName = "John", LastName = "Doe", Cellphone = "1234567890" } };
            _mockSet.Setup(m => m.Find(1)).Returns(coach);

            // Act
            var result = _repository.GetCoach(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("John Doe", result.Name);
            Assert.Equal("1234567890", result.Cellphone);
        }

        [Fact]
        public void GetCoachForSeason_ReturnsCorrectCoach()
        {
            // Arrange
            var coaches = new List<Coach>
            {
                new Coach { CoachId = 1, SeasonId = 1, PersonId = 1 },
                new Coach { CoachId = 2, SeasonId = 1, PersonId = 2 }
            }.AsQueryable();

            _mockSet.As<IQueryable<Coach>>().Setup(m => m.Provider).Returns(coaches.Provider);
            _mockSet.As<IQueryable<Coach>>().Setup(m => m.Expression).Returns(coaches.Expression);
            _mockSet.As<IQueryable<Coach>>().Setup(m => m.ElementType).Returns(coaches.ElementType);
            _mockSet.As<IQueryable<Coach>>().Setup(m => m.GetEnumerator()).Returns(coaches.GetEnumerator());

            // Act
            var result = _repository.GetCoachForSeason(1, 1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.CoachId);
        }

        [Fact]
        public void DeleteById_RemovesCoach()
        {
            // Arrange
            var coach = new Coach { CoachId = 1 };
            _mockSet.Setup(m => m.Find(1)).Returns(coach);

            // Act
            var result = _repository.DeleteById(1);

            // Assert
            Assert.True(result);
            _mockSet.Verify(m => m.Remove(It.IsAny<Coach>()), Times.Once);
            _mockContext.Verify(m => m.SaveChanges(), Times.Once);
        }

        [Fact]
        public void GetCoachVolunteers_ReturnsCorrectVolunteers()
        {
            // Arrange
            var people = new List<Person>
            {
                new Person { PersonId = 1, FirstName = "John", LastName = "Doe", Coach = true },
                new Person { PersonId = 2, FirstName = "Jane", LastName = "Smith", Coach = true }
            }.AsQueryable();

            var coaches = new List<Coach>
            {
                new Coach { CoachId = 1, SeasonId = 1, PersonId = 1 }
            }.AsQueryable();

            _mockContext.Setup(m => m.Set<Person>()).Returns(MockDbSet(people).Object);
            _mockSet.As<IQueryable<Coach>>().Setup(m => m.Provider).Returns(coaches.Provider);
            _mockSet.As<IQueryable<Coach>>().Setup(m => m.Expression).Returns(coaches.Expression);
            _mockSet.As<IQueryable<Coach>>().Setup(m => m.ElementType).Returns(coaches.ElementType);
            _mockSet.As<IQueryable<Coach>>().Setup(m => m.GetEnumerator()).Returns(coaches.GetEnumerator());

            // Act
            var result = _repository.GetCoachVolunteers(1, 1).ToList();

            // Assert
            Assert.Single(result);
            Assert.Equal("Smith, Jane", result[0].Name);
        }

        private Mock<DbSet<T>> MockDbSet<T>(IQueryable<T> data) where T : class
        {
            var mockSet = new Mock<DbSet<T>>();
            mockSet.As<IQueryable<T>>().Setup(m => m.Provider).Returns(data.Provider);
            mockSet.As<IQueryable<T>>().Setup(m => m.Expression).Returns(data.Expression);
            mockSet.As<IQueryable<T>>().Setup(m => m.ElementType).Returns(data.ElementType);
            mockSet.As<IQueryable<T>>().Setup(m => m.GetEnumerator()).Returns(data.GetEnumerator());
            return mockSet;
        }
    }
}