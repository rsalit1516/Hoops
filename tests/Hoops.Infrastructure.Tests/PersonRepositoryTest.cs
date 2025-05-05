using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Hoops.Core.Models;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Hoops.Infrastructure.Tests
{
    public class PersonRepositoryTest
    {
        private readonly Mock<hoopsContext> _mockContext;
        private readonly Mock<DbSet<Person>> _mockDbSet;
        private readonly PersonRepository _repository;
        private readonly Mock<ILogger<PersonRepository>> _mockLogger;

        private readonly hoopsContext context;
        public PersonRepository repo;
        private readonly ILogger<PersonRepository> _logger = new LoggerFactory().CreateLogger<PersonRepository>();

        public PersonRepositoryTest()
        {
            _mockContext = new Mock<hoopsContext>();
            _mockDbSet = new Mock<DbSet<Person>>();
            _mockLogger = new Mock<ILogger<PersonRepository>>();
            _logger = _mockLogger.Object;
            _repository = new PersonRepository(_mockContext.Object, _logger);
            var options = new DbContextOptionsBuilder<hoopsContext>()
                .UseInMemoryDatabase(databaseName: "hoops")
                .Options;
            context = new hoopsContext(options);
            repo = new PersonRepository(context, _logger);
        }

        [Fact]
        public void GetParents_ReturnsParents_WhenChildExists()
        {
            // Arrange
            var personId = 32560;
            var houseId = 8945;
            var child = new Person { PersonId = personId, HouseId = houseId };
            var parents = new List<Person>
            {
                new Person { HouseId = houseId, Parent = true, LastName = "Doe", FirstName = "John" },
                new Person { HouseId = houseId, Parent = true, LastName = "Doe", FirstName = "Jane" }
            }.AsQueryable();

            // _mockDbSet.Setup(m => m.Find(personId)).Returns(child);
            // _mockDbSet.Setup(m => m.Where(It.IsAny<Expression<Func<Person, bool>>>())).Returns(parents);

            // Act
            var result = repo.GetParents(personId);

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

        [Fact]
        public Task GetByHouseholdAsync_ReturnsHouseholdMembers_WhenHouseIdExists()
        {
            // Arrange
            var houseId = 8945;
            var householdMembers = new List<Person>
            {
                new Person { HouseId = houseId, LastName = "Doe", FirstName = "John" },
                new Person { HouseId = houseId, LastName = "Doe", FirstName = "Jane" }
            }.AsQueryable();

            // _mockDbSet.Setup(m => m.Where(It.IsAny<Expression<Func<Person, bool>>>())).Returns(householdMembers);

            // Act
            var result = repo.GetByHousehold(houseId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains("Doe, John", result.Select(p => $"{p.LastName}, {p.FirstName}"));
            Assert.Contains("Doe, Jane", result.Select(p => $"{p.LastName}, {p.FirstName}"));
            return Task.CompletedTask;
        }
        [Fact]
        public async Task InsertAsyncTest()
        {
            // Arrange
            var person = new Person { FirstName = "John", LastName = "Doe" };

            // _mockDbSet.Setup(m => m.AddAsync(person, default)).ReturnsAsync((EntityEntry<Person>)person);

            // Act
            var result = await repo.InsertAsync(person);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("John", result.FirstName);
            Assert.Equal("Doe", result.LastName);
        }
    }
}