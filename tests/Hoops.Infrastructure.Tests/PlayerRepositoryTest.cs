using Hoops.Core.Models;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Hoops.Infrastructure.Tests
{
    public class PlayerRepositoryTest
    {
        private PlayerRepository CreateRepositoryWithSeededContext(string? dbName = null)
        {
            var options = new DbContextOptionsBuilder<hoopsContext>()
                .UseInMemoryDatabase(databaseName: dbName ?? Guid.NewGuid().ToString())
                .Options;
            var context = new hoopsContext(options);

            // Seed Households
            var household1 = new Household
            {
                HouseId = 1,
                Name = "Johnson Family",
                Address1 = "123 Main St",
                City = "Springfield",
                Zip = "12345"
            };
            var household2 = new Household
            {
                HouseId = 2,
                Name = "Smith Family",
                Address1 = "456 Oak Ave",
                City = "Riverside",
                Zip = "67890"
            };
            context.Households.AddRange(household1, household2);

            // Seed Persons
            var person1 = new Person
            {
                PersonId = 1,
                FirstName = "John",
                LastName = "Johnson",
                BirthDate = new DateTime(2010, 5, 15),
                Grade = 6,
                HouseId = 1
            };
            var person2 = new Person
            {
                PersonId = 2,
                FirstName = "Jane",
                LastName = "Smith",
                BirthDate = new DateTime(2012, 8, 20),
                Grade = 4,
                HouseId = 2
            };
            context.People.AddRange(person1, person2);

            // Seed Season
            var season = new Season
            {
                SeasonId = 1,
                Description = "2024-25",
                FromDate = new DateTime(2024, 9, 1),
                ToDate = new DateTime(2025, 5, 31)
            };
            context.Seasons.Add(season);

            // Seed Divisions
            var division1 = new Division
            {
                DivisionId = 1,
                SeasonId = 1,
                DivisionDescription = "U12 Boys",
                MinDate = new DateTime(2010, 1, 1),
                MaxDate = new DateTime(2012, 12, 31)
            };
            var division2 = new Division
            {
                DivisionId = 2,
                SeasonId = 1,
                DivisionDescription = "U14 Girls",
                MinDate2 = new DateTime(2008, 1, 1),
                MaxDate2 = new DateTime(2010, 12, 31)
            };
            context.Divisions.AddRange(division1, division2);

            // Seed Players
            var player1 = new Player
            {
                PlayerId = 1,
                PersonId = 1,
                SeasonId = 1,
                DivisionId = 1,
                DraftId = "001"
            };
            var player2 = new Player
            {
                PlayerId = 2,
                PersonId = 2,
                SeasonId = 1,
                DivisionId = 2,
                DraftId = "002"
            };
            context.Players.AddRange(player1, player2);

            context.SaveChanges();
            return new PlayerRepository(context);
        }

        [Fact]
        public void GetDraftListPlayers_ReturnsAllPlayersForSeason_WhenNoDivisionSpecified()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();

            // Act
            var result = repo.GetDraftListPlayers(1, null);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, p => p.LastName == "Johnson" && p.FirstName == "John");
            Assert.Contains(result, p => p.LastName == "Smith" && p.FirstName == "Jane");
        }

        [Fact]
        public void GetDraftListPlayers_ReturnsOnlySpecifiedDivision_WhenDivisionSpecified()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();

            // Act
            var result = repo.GetDraftListPlayers(1, 1);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal("Johnson", result[0].LastName);
            Assert.Equal("John", result[0].FirstName);
            Assert.Equal("U12 Boys", result[0].Division);
        }

        [Fact]
        public void GetDraftListPlayers_ReturnsCorrectFields()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();

            // Act
            var result = repo.GetDraftListPlayers(1, 1);

            // Assert
            Assert.NotNull(result);
            var player = result[0];
            Assert.Equal("U12 Boys", player.Division);
            Assert.Equal("001", player.DraftId);
            Assert.Equal("Johnson", player.LastName);
            Assert.Equal("John", player.FirstName);
            Assert.NotNull(player.DOB);
            Assert.Equal(new DateTime(2010, 5, 15).Date, player.DOB.Value.Date);
            Assert.Equal(6, player.Grade);
            Assert.Equal("123 Main St", player.Address1);
            Assert.Equal("Springfield", player.City);
            Assert.Equal("12345", player.Zip);
        }

        [Fact]
        public void GetDraftListPlayers_ReturnsEmptyList_WhenNoPlayersExist()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();

            // Act
            var result = repo.GetDraftListPlayers(999, null);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public void GetDraftListPlayers_OrdersByDivisionLastNameFirstName()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();

            // Act
            var result = repo.GetDraftListPlayers(1, null);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            // U12 Boys comes before U14 Girls alphabetically
            Assert.Equal("U12 Boys", result[0].Division);
            Assert.Equal("U14 Girls", result[1].Division);
        }
    }
}
