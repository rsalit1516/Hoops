using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;
using Hoops.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace Hoops.Core.Repository.Test
{
    public class WebContentRepositoryTest
    {
        private readonly WebContentRepository _repository;
        private readonly Mock<hoopsContext> _mockContext;

        public WebContentRepositoryTest()
        {
            _mockContext = new Mock<hoopsContext>();
            _repository = new WebContentRepository(_mockContext.Object);
        }

        [Fact]
        public async Task GetAllAsync_ReturnsAllWebContents()
        {
            // Arrange
            var companyId = 1;
            var webContents = new List<WebContent>
            {
                new WebContent { WebContentId = 1, CompanyId = companyId, Title = "Title1" },
                new WebContent { WebContentId = 2, CompanyId = companyId, Title = "Title2" }
            };
            var webContentTypes = new List<WebContentType>
            {
                new WebContentType { WebContentTypeId = 1, WebContentTypeDescription = "Type1" },
                new WebContentType { WebContentTypeId = 2, WebContentTypeDescription = "Type2" }
            };

            var mockSet = new Mock<DbSet<WebContent>>();
            mockSet.As<IQueryable<WebContent>>().Setup(m => m.GetEnumerator()).Returns(webContents.AsQueryable().GetEnumerator());
            mockSet.As<IQueryable<WebContent>>().Setup(m => m.ElementType).Returns(webContents.AsQueryable().ElementType);
            mockSet.As<IQueryable<WebContent>>().Setup(m => m.Expression).Returns(webContents.AsQueryable().Expression);
            mockSet.As<IQueryable<WebContent>>().Setup(m => m.Provider).Returns(webContents.AsQueryable().Provider);

            var mockTypeSet = new Mock<DbSet<WebContentType>>();
            mockTypeSet.As<IQueryable<WebContentType>>().Setup(m => m.GetEnumerator()).Returns(webContentTypes.AsQueryable().GetEnumerator());
            mockTypeSet.As<IQueryable<WebContentType>>().Setup(m => m.ElementType).Returns(webContentTypes.AsQueryable().ElementType);
            mockTypeSet.As<IQueryable<WebContentType>>().Setup(m => m.Expression).Returns(webContentTypes.AsQueryable().Expression);
            mockTypeSet.As<IQueryable<WebContentType>>().Setup(m => m.Provider).Returns(webContentTypes.AsQueryable().Provider);

            _mockContext.Setup(c => c.WebContents).Returns(mockSet.Object);
            _mockContext.Setup(c => c.WebContentTypes).Returns(mockTypeSet.Object);

            // Act
            var result = await _repository.GetAllAsync(companyId);

            // Assert
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetActiveWebContentAsync_ReturnsActiveWebContents()
        {
            // Arrange
            var companyId = 1;
            var webContents = new List<WebContent>
            {
                new WebContent { WebContentId = 1, CompanyId = companyId, Title = "Title1", 
                ExpirationDate = DateTime.Now.AddDays(1) },
                new WebContent { WebContentId = 2, CompanyId = companyId, Title = "Title2", ExpirationDate = DateTime.Now.AddDays(-1) }
            };
            var webContentTypes = new List<WebContentType>
            {
                new WebContentType { WebContentTypeId = 1, WebContentTypeDescription = "Type1" },
                new WebContentType { WebContentTypeId = 2, WebContentTypeDescription = "Type2" }
            };

            var mockSet = new Mock<DbSet<WebContent>>();
            mockSet.As<IQueryable<WebContent>>().Setup(m => m.GetEnumerator()).Returns(webContents.AsQueryable().GetEnumerator());
            mockSet.As<IQueryable<WebContent>>().Setup(m => m.ElementType).Returns(webContents.AsQueryable().ElementType);
            mockSet.As<IQueryable<WebContent>>().Setup(m => m.Expression).Returns(webContents.AsQueryable().Expression);
            mockSet.As<IQueryable<WebContent>>().Setup(m => m.Provider).Returns(webContents.AsQueryable().Provider);

            var mockTypeSet = new Mock<DbSet<WebContentType>>();
            mockTypeSet.As<IQueryable<WebContentType>>().Setup(m => m.GetEnumerator()).Returns(webContentTypes.AsQueryable().GetEnumerator());
            mockTypeSet.As<IQueryable<WebContentType>>().Setup(m => m.ElementType).Returns(webContentTypes.AsQueryable().ElementType);
            mockTypeSet.As<IQueryable<WebContentType>>().Setup(m => m.Expression).Returns(webContentTypes.AsQueryable().Expression);
            mockTypeSet.As<IQueryable<WebContentType>>().Setup(m => m.Provider).Returns(webContentTypes.AsQueryable().Provider);

            _mockContext.Setup(c => c.WebContents).Returns(mockSet.Object);
            _mockContext.Setup(c => c.WebContentTypes).Returns(mockTypeSet.Object);

            // Act
            var result = await _repository.GetActiveWebContentAsync(companyId);

            // Assert
            Assert.Single(result);
        }
    }
}
