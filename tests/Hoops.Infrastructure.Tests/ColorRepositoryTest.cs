using Hoops.Core.Models;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using Xunit;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Hoops.Infrastructure.Tests
{
    public class ColorRepositoryTest
    {
        private ColorRepository CreateRepositoryWithSeededContext(string? dbName = null)
        {
            var options = new DbContextOptionsBuilder<hoopsContext>()
                .UseInMemoryDatabase(databaseName: dbName ?? Guid.NewGuid().ToString())
                .Options;
            var context = new hoopsContext(options);
            context.Colors.AddRange(new List<Color>
            {
                new Color { ColorId = 1, CompanyId = 1, ColorName = "Red" },
                new Color { ColorId = 2, CompanyId = 1, ColorName = "Blue" },
                new Color { ColorId = 3, CompanyId = 2, ColorName = "Green" }
            });
            context.SaveChanges();
            return new ColorRepository(context);
        }

        [Fact]
        public void GetAll_ReturnsColorsForCompany()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            // Act
            var colors = repo.GetAll(1).ToList();
            // Assert
            Assert.Equal(2, colors.Count);
        }

        [Fact]
        public void GetByName_ReturnsCorrectColor()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            // Act
            var color = repo.GetByName(1, "Red");
            // Assert
            Assert.NotNull(color);
            Assert.Equal("Red", color.ColorName);
        }

        [Fact]
        public void Insert_AddsColor()
        {
            // Arrange
            var repo = CreateRepositoryWithSeededContext();
            var newColor = new Color { CompanyId = 1, ColorName = "Yellow" };
            // Act
            repo.Insert(newColor);
            repo.SaveChanges();
            // Assert
            var found = repo.GetByName(1, "Yellow");
            Assert.NotNull(found);
            Assert.Equal("Yellow", found.ColorName);
        }
    }
}
