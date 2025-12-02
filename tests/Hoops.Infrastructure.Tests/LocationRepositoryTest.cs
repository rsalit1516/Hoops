using Hoops.Core.Models;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using Xunit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hoops.Infrastructure.Tests
{
    public class LocationRepositoryTest
    {
        private LocationRepository CreateRepositoryWithSeededContext(string? dbName = null)
        {
            var options = new DbContextOptionsBuilder<hoopsContext>()
                .UseInMemoryDatabase(databaseName: dbName ?? Guid.NewGuid().ToString())
                .Options;
            var context = new hoopsContext(options);
            context.Location.AddRange(new List<Location>
            {
                new Location { LocationNumber = 1, LocationName = "Main Gym" },
                new Location { LocationNumber = 2, LocationName = "Aux Gym" }
            });
            context.SaveChanges();
            return new LocationRepository(context);
        }

        [Fact]
        public async Task GetAll_ReturnsAllLocations()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            // Act
            var locations = (await repo.GetAll()).ToList();
            // Assert
            Assert.Equal(2, locations.Count);
        }

        [Fact]
        public void GetByName_ReturnsCorrectLocation()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            // Act
            var location = repo.GetByName("Main Gym");
            // Assert
            Assert.NotNull(location);
            Assert.Equal("Main Gym", location.LocationName);
        }

        [Fact]
        public void Insert_AddsLocation()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            var newLocation = new Location { LocationName = "Field House" };
            // Act
            repo.Insert(newLocation);
            repo.SaveChanges();
            // Assert
            var found = repo.GetByName("Field House");
            Assert.NotNull(found);
            Assert.Equal("Field House", found.LocationName);
        }
    }
}
