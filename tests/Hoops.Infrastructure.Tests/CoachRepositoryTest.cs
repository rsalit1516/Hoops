using Hoops.Core.Models;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace Hoops.Infrastructure.Tests
{
public class CoachRepositoryTest : IDisposable
{
    private readonly hoopsContext _context;
    private readonly CoachRepository _repository;

    public CoachRepositoryTest()
    {
        var options = new DbContextOptionsBuilder<hoopsContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new hoopsContext(options);
        _repository = new CoachRepository(_context);
        SeedDatabase();
    }

    private void SeedDatabase()
    {
        var person1 = new Person { PersonId = 1, FirstName = "John", LastName = "Doe", Cellphone = "1234567890" };
        var person2 = new Person { PersonId = 2, FirstName = "Jane", LastName = "Smith", Cellphone = "5555555555" };
        _context.People.AddRange(person1, person2);
        _context.Coaches.AddRange(
            new Coach { CoachId = 1, SeasonId = 1, PersonId = 1, Person = person1, CoachPhone = "111-111-1111", ShirtSize = "M" },
            new Coach { CoachId = 2, SeasonId = 1, PersonId = 2, Person = person2, CoachPhone = "222-222-2222", ShirtSize = "L" }
        );
        _context.SaveChanges();
    }

    public void Dispose()
    {
        _context.Dispose();
    }

        [Fact]
    public void GetSeasonCoaches_ReturnsCorrectCoaches()
    {
        // Act
        var result = _repository.GetSeasonCoaches(1).ToList();

        // Assert
        Assert.Equal(2, result.Count);
        Assert.Contains(result, c => c.Name == "Doe, John");
        Assert.Contains(result, c => c.Name == "Smith, Jane");
    }

        [Fact]
    public void GetCoach_ReturnsCorrectCoach()
    {
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
            var coach = new Coach { CoachId = 99, SeasonId = 2, PersonId = 2 };
            _context.Coaches.Add(coach);
            _context.SaveChanges();

            // Act
            var result = _repository.DeleteById(99);

            // Assert
            Assert.True(result);
            Assert.Null(_context.Coaches.Find(99));
        }

        [Fact]
        public void GetCoachVolunteers_ReturnsCorrectVolunteers()
        {
            // Arrange: Add a Person with Coach=true who is NOT in Coaches for season 1
            var person4 = new Person { PersonId = 4, FirstName = "Bob", LastName = "Williams", Coach = true };
            _context.People.Add(person4);
            _context.SaveChanges();

            // Act
            var result = _repository.GetCoachVolunteers(1, 1).ToList();

            // Assert
            Assert.Contains(result, c => c.Name == "Williams, Bob");
        }

    }
}