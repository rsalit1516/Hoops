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
    public class DivisionRepositoryTest
    {
        private DivisionRepository CreateRepositoryWithSeededContext(string? dbName = null)
        {
            var options = new DbContextOptionsBuilder<hoopsContext>()
                .UseInMemoryDatabase(databaseName: dbName ?? Guid.NewGuid().ToString())
                .Options;
            var context = new hoopsContext(options);
            context.Divisions.AddRange(new List<Division>
            {
                new Division { DivisionId = 1, SeasonId = 1, DivisionDescription = "Boys 10U", Gender = "M", MinDate = new DateTime(2014, 1, 1), MaxDate = new DateTime(2015, 12, 31) },
                new Division { DivisionId = 2, SeasonId = 1, DivisionDescription = "Girls 10U", Gender = "F", MinDate = new DateTime(2014, 1, 1), MaxDate = new DateTime(2015, 12, 31) },
                new Division { DivisionId = 3, SeasonId = 2, DivisionDescription = "Boys 12U", Gender = "M", MinDate = new DateTime(2012, 1, 1), MaxDate = new DateTime(2013, 12, 31) }
            });
            context.SaveChanges();
            return new DivisionRepository(context);
        }

        [Fact]
        public void GetDivisions_ReturnsDivisionsForSeason()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            // Act
            var divisions = repo.GetDivisions(1).ToList();
            // Assert
            Assert.Equal(2, divisions.Count);
        }

        [Fact]
        public async Task GetSeasonDivisionsAsync_ReturnsDivisionsForSeason()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            // Act
            var divisions = await repo.GetSeasonDivisionsAsync(1);
            // Assert
            Assert.Equal(2, divisions.Count());
        }

        [Fact]
        public void GetAD_ReturnsDivisionsForDirector()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            // Add a director to a division
            var context = new hoopsContext(new DbContextOptionsBuilder<hoopsContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);
            var directorId = 99;
            context.Divisions.Add(new Division { DivisionId = 4, SeasonId = 1, DivisionDescription = "Director Div", Gender = "M", DirectorId = directorId, MinDate = new DateTime(2010, 1, 1), MaxDate = new DateTime(2011, 12, 31) });
            context.SaveChanges();
            var repo2 = new DivisionRepository(context);
            // Act
            var divisions = repo2.GetAD(1, directorId).ToList();
            // Assert
            Assert.Single(divisions);
            Assert.Equal("Director Div", divisions[0].DivisionDescription);
        }
    }
}
