using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Hoops.Core.Models;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace Hoops.Infrastructure.Tests.Repository
{
    public class PersonRepositoryTest
    {
        private readonly Mock<hoopsContext> _mockContext;
        private readonly Mock<DbSet<Person>> _mockDbSet;
        private readonly PersonRepository _repository;

        public PersonRepositoryTest()
        {
            _mockContext = new Mock<hoopsContext>();
            _mockDbSet = new Mock<DbSet<Person>>();
            _mockContext.Setup(m => m.Set<Person>()).Returns(_mockDbSet.Object);
            _repository = new PersonRepository(_mockContext.Object);
        }

        [Fact]
        public void GetParents_ReturnsParents_WhenChildExists()
        {
            // Arrange
            var personId = 1;
            var houseId = 1;
            var child = new Person { PersonId = personId, HouseId = houseId };
            var parents = new List<Person>
            {
                new Person { HouseId = houseId, Parent = true, LastName = "Doe", FirstName = "John" },
                new Person { HouseId = houseId, Parent = true, LastName = "Doe", FirstName = "Jane" }
            }.AsQueryable();

            _mockDbSet.Setup(m => m.Find(personId)).Returns(child);
            _mockDbSet.Setup(m => m.Where(It.IsAny<Expression<Func<Person, bool>>>())).Returns(parents);

            // Act
            var result = _repository.GetParents(personId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains("Doe, John", result);
            Assert.Contains("Doe, Jane", result);
        }

        [Fact]
        public void GetParents_ReturnsEmptyList_WhenChildDoesNotExist()
        {
            // Arrange
            var personId = 1;
            _mockDbSet.Setup(m => m.Find(personId)).Returns((Person?)null);

            // Act
            var result = _repository.GetParents(personId);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public void GetParents_ReturnsEmptyList_WhenNoParentsExist()
        {
            // Arrange
            var personId = 1;
            var houseId = 1;
            var child = new Person { PersonId = personId, HouseId = houseId };
            var parents = new List<Person>().AsQueryable();

            _mockDbSet.Setup(m => m.Find(personId)).Returns(child);
            _mockDbSet.Setup(m => m.Where(It.IsAny<Expression<Func<Person, bool>>>())).Returns(parents);

            // Act
            var result = _repository.GetParents(personId);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }
    }
}