using Hoops.Core.Models;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;

namespace Hoops.Infrastructure.Tests
{
    [Collection("TestDatabaseCollection")]
    public class PersonRepositoryTest : IClassFixture<TestDatabaseFixture>
    {
        private readonly hoopsContext _context;
        private readonly PersonRepository _repository;

        // private readonly Mock<ILogger<PersonRepository>> _mockLogger;

        private readonly ILogger<PersonRepository> _logger = new LoggerFactory().CreateLogger<PersonRepository>();

        public PersonRepositoryTest(TestDatabaseFixture fixture)
        {
            var options = new DbContextOptionsBuilder<hoopsContext>()
 .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
 .Options;
            _context = new hoopsContext(options);
            // _context = fixture.Context ?? throw new ArgumentNullException(nameof(fixture.Context), "Context cannot be null");
            _repository = new PersonRepository(_context, _logger);
            SeedDatabase();
        }

        private void SeedDatabase()
        {
            var maxHouseId = 0;
            var maxPersonId = 0;
            // Add test data to the in-memory database
            _context.People.AddRange(new List<Person>
            {
                new Person { PersonId = maxPersonId + 1, FirstName = "John", LastName = "Doe", Player = true },
                new Person { PersonId = maxPersonId + 2, FirstName = "Jane", LastName = "Smith", Player = false },
                new Person { PersonId = maxPersonId + 3, FirstName = "Felix", LastName = "Smith", Player = true },
                new Person { PersonId = maxPersonId + 4, FirstName = "Minnie", LastName = "Johnson", Player = false },
         new Person { PersonId = maxPersonId + 5, HouseId = maxHouseId, Parent = true, LastName = "Johnson", FirstName = "John" },
                new Person { PersonId = maxPersonId + 6,HouseId = maxHouseId, Parent = true, LastName = "Johnson", FirstName = "Jane" }

            });

            _context.SaveChanges();
        }
        [Fact]
        public void GetAll_ReturnPeopleByLastNameFirstNameAndPlayer()
        {
            // Arrange

            // Act
            var result = _repository.FindPeopleByLastAndFirstName("Smith", "Jane", false);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.Count());
        }
        [Fact]
        public void GetParents_ReturnsParents_WhenChildExists()
        {
            // Arrange
            var personId = 5;
            // Act
            var result = _repository.GetParents(personId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            // Assert.Contains("Doe, John", result);
            // Assert.Contains("Doe, Jane", result);
        }

        [Fact]
        public void GetParents_ReturnsEmptyList_WhenChildDoesNotExist()
        {
            // Arrange
            var personId = 999999;

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
            var personId = _context.People.Max(p => p.PersonId) + 1;
            // var houseId = _repository.GetAll().Max(p => p.HouseId) + 1; ;
            // var child = new Person { PersonId = personId, HouseId = houseId };

            // Act
            var result = _repository.GetParents(personId);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        // [Fact]
        // public Task GetByHouseholdAsync_ReturnsHouseholdMembers_WhenHouseIdExists()
        // {
        //     // Arrange
        //     // var houseId = 8945;
        //     // var householdMembers = new Person[]
        //     // {
        //     //     new Person { HouseId = houseId, LastName = "Doe", FirstName = "John" },
        //     //     new Person { HouseId = houseId, LastName = "Doe", FirstName = "Jane" }
        //     // };

        //     // _repository.Insert(householdMembers[0]);
        //     // _repository.Insert(householdMembers[1]);
        //     // _repository.SaveChanges();
        //     // _mockDbSet.Setup(m => m.Where(It.IsAny<Expression<Func<Person, bool>>>())).Returns(householdMembers);

        //     // Act
        //     var result = _repository.GetByHousehold(4);

        //     // Assert
        //     Assert.NotNull(result);
        //     Assert.Equal(2, result.Count);
        //     Assert.Contains("Doe, John", result.Select(p => $"{p.LastName}, {p.FirstName}"));
        //     Assert.Contains("Doe, Jane", result.Select(p => $"{p.LastName}, {p.FirstName}"));
        //     return Task.CompletedTask;
        // }
        [Fact]
        public async Task InsertAsyncTest()
        {
            // Arrange
            var maxHouseId = 0;
            var maxPersonId = 0;

            var person = new Person { PersonId = maxPersonId + 6, HouseId = maxHouseId, Parent = true, LastName = "Johnson", FirstName = "Jane" };

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