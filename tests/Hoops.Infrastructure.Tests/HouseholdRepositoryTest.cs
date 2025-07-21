using Hoops.Core.Models;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Xunit;
using System;
using System.Collections.Generic;
using System.Linq;
using Hoops.Core.ViewModels;

namespace Hoops.Infrastructure.Tests
{
    public class HouseholdRepositoryTest
    {
        private HouseholdRepository CreateRepositoryWithSeededContext(string? dbName = null)
        {
            var options = new DbContextOptionsBuilder<hoopsContext>()
                .UseInMemoryDatabase(databaseName: dbName ?? Guid.NewGuid().ToString())
                .Options;
            var context = new hoopsContext(options);
            // Seed data
            context.Households.AddRange(new List<Household>
            {
                new Household { HouseId = 1, Name = "Smith Family", Address1 = "123 Main St", Phone = "555-1234", Email = "smith@example.com", CompanyId = 1 },
                new Household { HouseId = 2, Name = "Johnson Family", Address1 = "456 Oak Ave", Phone = "555-5678", Email = "johnson@example.com", CompanyId = 1 },
                new Household { HouseId = 3, Name = "Williams Family", Address1 = "789 Pine Rd", Phone = "555-9012", Email = "williams@example.com", CompanyId = 2 }
            });
            context.SaveChanges();
            return new HouseholdRepository(context);
        }

        [Fact]
        public void GetAll_ReturnsAllHouseholdsForCompany()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            // Act
            var households = repo.GetAll(1).ToList();
            // Assert
            Assert.Equal(2, households.Count);
        }

        [Fact]
        public void GetRecords_FiltersByName()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            // Act
            var result = repo.GetRecords(1, name: "Smith").ToList();
            // Assert
            Assert.Single(result);
            Assert.Equal("Smith Family", result[0].Name);
        }

        [Fact]
        public void GetByName_ReturnsCorrectHousehold()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            // Act
            var result = repo.GetByName("Johnson Family").ToList();
            // Assert
            Assert.Single(result);
            Assert.Equal("Johnson Family", result[0].Name);
        }

        [Fact]
        public void Insert_AddsHousehold()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            var newHousehold = new Household { Name = "Brown Family", Address1 = "101 Maple St", Phone = "555-0000", Email = "brown@example.com", CompanyId = 1 };
            // Act
            repo.Insert(newHousehold);
            // Assert
            var found = repo.GetByName("Brown Family").FirstOrDefault();
            Assert.NotNull(found);
            Assert.Equal("Brown Family", found.Name);
        }

        [Fact]
        public void Update_ChangesHousehold()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            var household = repo.GetByName("Smith Family").First();
            household.Address1 = "999 New Address";
            repo.Update(household);
            // Assert
            var updated = repo.GetByName("Smith Family").First();
            Assert.Equal("999 New Address", updated.Address1);
        }

        [Fact]
        public void SearchHouseholds_FiltersByCriteria()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            var criteria = new HouseholdSearchCriteria { Name = "Williams" };
            // Act
            var result = repo.SearchHouseholds(criteria);
            // Assert
            Assert.Single(result);
            Assert.Equal("Williams Family", result[0].Name);
        }
    }
}
