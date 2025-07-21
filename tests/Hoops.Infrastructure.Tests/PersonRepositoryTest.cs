using Hoops.Core.Models;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;

namespace Hoops.Infrastructure.Tests
{
    public class PersonRepositoryTest
    {
        private PersonRepository CreateRepositoryWithSeededContext(string? dbName = null)
        {
            var options = new DbContextOptionsBuilder<hoopsContext>()
                .UseInMemoryDatabase(databaseName: dbName ?? Guid.NewGuid().ToString())
                .Options;
            var context = new hoopsContext(options);
            var logger = new LoggerFactory().CreateLogger<PersonRepository>();
            // Seed data
            context.People.AddRange(new List<Person>
            {
                new Person { PersonId = 1, FirstName = "John", LastName = "Doe", Player = true },
                new Person { PersonId = 2, FirstName = "Jane", LastName = "Smith", Player = false },
                new Person { PersonId = 3, FirstName = "Felix", LastName = "Smith", Player = true },
                new Person { PersonId = 4, FirstName = "Minnie", LastName = "Johnson", Player = false },
                new Person { PersonId = 5, HouseId = 1, Parent = true, LastName = "Johnson", FirstName = "John" },
                new Person { PersonId = 6, HouseId = 1, Parent = true, LastName = "Johnson", FirstName = "Jane" }
            });
            context.SaveChanges();
            return new PersonRepository(context, logger);
        }

        [Fact]
        public void GetAll_ReturnsAllPeople()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            // Act
            var people = repo.GetAll();
            // Assert
            Assert.NotNull(people);
            Assert.True(people.Any());
        }

        [Fact]
        public void GetPlayers_ReturnsOnlyPlayers()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            // Act
            var players = repo.GetPlayers(0); // companyId not used in seed
            // Assert
            Assert.All(players, p => Assert.True(p.Player));
        }

        [Fact]
        public void SearchFor_ReturnsMatchingPeople()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            // Act
            var result = repo.SearchFor(p => p.LastName == "Smith");
            // Assert
            Assert.NotNull(result);
            Assert.True(result.Any());
        }

        [Fact]
        public void Insert_AddsPerson()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            var newPerson = new Person { PersonId = 7, FirstName = "Alice", LastName = "Wonder", Player = false };
            // Act
            repo.Insert(newPerson);
            repo.SaveChanges();
            // Assert
            var found = repo.GetById(7);
            Assert.NotNull(found);
            Assert.Equal("Alice", found.FirstName);
        }

        [Fact]
        public void Update_ChangesPerson()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            var person = repo.GetById(1);
            person.FirstName = "Johnny";
            repo.Update(person);
            repo.SaveChanges();
            // Assert
            var updated = repo.GetById(1);
            Assert.Equal("Johnny", updated.FirstName);
        }

        [Fact]
        public void Delete_RemovesPerson()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            var person = repo.GetById(1);
            repo.Delete(person);
            repo.SaveChanges();
            // Assert
            var deleted = repo.GetById(1);
            Assert.Null(deleted);
        }

        [Fact]
        public void FindPeopleByLastAndFirstName_ReturnsCorrectPerson()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            // Act
            var result = repo.FindPeopleByLastAndFirstName("Smith", "Jane", false);
            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal("Jane", result.First().FirstName);
        }

        [Fact]
        public async Task InsertAsync_AddsPerson()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            var person = new Person { PersonId = 8, FirstName = "Bob", LastName = "Builder", Player = false };
            // Act
            var result = await repo.InsertAsync(person);
            repo.SaveChanges();
            // Assert
            Assert.NotNull(result);
            Assert.Equal("Bob", result.FirstName);
            Assert.Equal("Builder", result.LastName);
        }

        [Fact]
        public void GetParents_ReturnsParents_WhenChildExists()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            var personId = 5;
            // Act
            var result = repo.GetParents(personId);
            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public void GetParents_ReturnsEmptyList_WhenChildDoesNotExist()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            var personId = 999999;
            // Act
            var result = repo.GetParents(personId);
            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public void GetParents_ReturnsEmptyList_WhenNoParentsExist()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            var personId = 1000;
            // Act
            var result = repo.GetParents(personId);
            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }
        // Additional custom method tests can be added here as needed.
    }
}