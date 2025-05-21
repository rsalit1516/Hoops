using Hoops.Core.Models;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;
using Microsoft.EntityFrameworkCore;

namespace Hoops.Infrastructure.Tests
{
    public class WebContentRepositoryTest : IClassFixture<TestDatabaseFixture>, IDisposable
    {
        private readonly WebContentRepository _repository;
        private readonly hoopsContext _context;

        public WebContentRepositoryTest(TestDatabaseFixture fixture)
        {
            var options = new DbContextOptionsBuilder<hoopsContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new hoopsContext(options);
            _repository = new WebContentRepository(_context);
            SeedDatabase();
        }

        private void SeedDatabase()
        {
            var companyId = 1;
            _context.WebContentTypes.AddRange(new List<WebContentType>
            {
                new WebContentType { WebContentTypeId = 1, WebContentTypeDescription = "Type1" },
                new WebContentType { WebContentTypeId = 2, WebContentTypeDescription = "Type2" }
            });
            _context.SaveChanges();

            _context.WebContents.AddRange(new List<WebContent>
            {
                new WebContent { WebContentId = 1, CompanyId = companyId, Title = "Title1", WebContentTypeId = 1, ExpirationDate = DateTime.Now.AddDays(1) },
                 new WebContent { WebContentId = 2, CompanyId = companyId, Title = "Test content", WebContentTypeId = 2, ExpirationDate = DateTime.Now.AddDays(20) },
                new WebContent { WebContentId = 3, CompanyId = companyId, Title = "Title2", WebContentTypeId =1, ExpirationDate = DateTime.Now.AddDays(-1) },
            });
            _context.SaveChanges();

        }

        public void Dispose()
        {
            _context.Dispose();
        }

        [Fact]
        public async Task GetAllAsync_ReturnsAllWebContents()
        {
            // Arrange
            var companyId = 1;

            // Act
            var result = await _repository.GetAllAsync(companyId);

            // Assert
            Assert.Equal(3, result.Count());
        }

        [Fact]
        public async Task GetActiveWebContentAsync_ReturnsActiveWebContents()
        {
            // Arrange
            var companyId = 1;
            // Act
            var result = await _repository.GetActiveWebContentAsync(companyId);

            // Assert
            Assert.True(result.Count() > 0);
        }
    }
}


