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
        private readonly hoopsContext _context;
        private readonly PersonRepository _repository;
        // private readonly Mock<hoopsContext> _mockContext;
        // private readonly Mock<DbSet<Person>> _mockDbSet;

        private readonly Mock<ILogger<PersonRepository>> _mockLogger;

        // private readonly hoopsContext context;
        // public PersonRepository repo;
        private readonly ILogger<PersonRepository> _logger = new LoggerFactory().CreateLogger<PersonRepository>();

        public PersonRepositoryTest(TestDatabaseFixture fixture)
        {
            _context = fixture.Context ?? throw new ArgumentNullException(nameof(fixture.Context), "Context cannot be null");
            _repository = new PersonRepository(_context, _logger);
            // _mockDbSet = new Mock<DbSet<Person>>();
            _mockLogger = new Mock<ILogger<PersonRepository>>();
            // _mockLogger = new Mock<ILogger<PersonRepository>>();
            _logger = _mockLogger.Object;
            // _repository = new PersonRepository(_mockContext.Object, _logger);
            // _mockContext = new Mock<hoopsContext>();
            // _mockDbSet = new Mock<DbSet<Person>>();
            // _mockLogger = new Mock<ILogger<PersonRepository>>();
            // _logger = _mockLogger.Object;
            // _repository = new PersonRepository(_mockContext.Object, _logger);
            // var options = new DbContextOptionsBuilder<hoopsContext>()
            //     .UseInMemoryDatabase(databaseName: "hoops")
            //     .Options;
            // context = new hoopsContext(options);

        }

        [Fact]
        public void GetParents_ReturnsParents_WhenChildExists()
        {
            // Arrange
            var personId = 32560;
            var houseId = 8945;
            var child = new Person { PersonId = personId, HouseId = houseId };
            var parents = new Person[]
            {
                new Person { HouseId = houseId, Parent = true, LastName = "Doe", FirstName = "John" },
                new Person { HouseId = houseId, Parent = true, LastName = "Doe", FirstName = "Jane" }
            };

            _repository.Insert(child);
            _repository.Insert(parents[0]);
            _repository.Insert(parents[1]);
            _repository.SaveChanges();
            // _mockDbSet.Setup(m => m.Find(personId)).Returns(child);
            // _mockDbSet.Setup(m => m.Where(It.IsAny<Expression<Func<Person, bool>>>())).Returns(parents);

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
            var personId = 999999;
            //_mockDbSet.Setup(m => m.Find(personId)).Returns((Person?)null);

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
            var personId = _repository.GetAll().Max(p => p.PersonId) + 1;
            var houseId = _repository.GetAll().Max(p => p.HouseId) + 1; ;
            var child = new Person { PersonId = personId, HouseId = houseId };
            var parents = new List<Person>().AsQueryable();

            _repository.Insert(child);
            _repository.SaveChanges();
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
            var householdMembers = new Person[]
            {
                new Person { HouseId = houseId, LastName = "Doe", FirstName = "John" },
                new Person { HouseId = houseId, LastName = "Doe", FirstName = "Jane" }
            };

            _repository.Insert(householdMembers[0]);
            _repository.Insert(householdMembers[1]);
            _repository.SaveChanges();
            // _mockDbSet.Setup(m => m.Where(It.IsAny<Expression<Func<Person, bool>>>())).Returns(householdMembers);

            // Act
            var result = _repository.GetByHousehold(houseId);

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
            var result = await _repository.InsertAsync(person);
            _repository.SaveChanges();


            // Assert
            Assert.NotNull(result);
            Assert.Equal("John", result.FirstName);
            Assert.Equal("Doe", result.LastName);
        }
    }
}