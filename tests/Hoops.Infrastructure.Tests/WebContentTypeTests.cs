using Hoops.Core.Models;
using Hoops.Infrastructure.Repository;
using Hoops.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Hoops.Infrastructure.Tests
{
    public class WebContentTypeTest : IClassFixture<TestDatabaseFixture>, IDisposable
    {
        private readonly hoopsContext _context;
        // public hoopsContext context;
        public WebContentTypeRepository repo;
        public WebContentRepository repoWebContent;

        public WebContentTypeTest()
        {
            var options = new DbContextOptionsBuilder<hoopsContext>()
.UseInMemoryDatabase(databaseName: "hoops")
.Options;
            _context = new hoopsContext(options);
            repo = new WebContentTypeRepository(_context);
            repoWebContent = new WebContentRepository(_context); // Initialize repoWebContent
            SeedDatabase();
        }

        private void SeedDatabase()
        {
            var companyId = 1;
            _context.WebContentTypes.AddRange(new List<WebContentType>
            {
                new WebContentType { WebContentTypeId = 1, WebContentTypeDescription = "Season Info" },
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
        public async Task GetByWebContentTypeDescription()
        {
            var result = await repo.GetByDescriptionAsync("Season Info");
            Assert.True(result != null);

        }


        [Fact]
        public async Task AddAsyncWebContentTypeTest1()
        {
            // await DeleteAllAsync(repo);
            var found = await repo.GetAllAsync();
            // if (!found.Any())
            // {
            var entity = new WebContentType
            {
                WebContentTypeDescription = "Meeting"
            };
            var actual = await repo.InsertAsync(entity);
            await _context.SaveChangesAsync();
            Assert.True(actual != null);
            // }

        }
        [Fact]
        public async Task AddAllAsyncWebContentTypeTest1()
        {

            var records = await repo.GetAllAsync();


            Assert.True(records.Any());

        }

        private async Task DeleteAllAsync(WebContentTypeRepository repo)
        {
            var records = await repo.GetAllAsync();
            foreach (var record in records)
            {
                await repo.DeleteAsync(record.WebContentTypeId);
            }
        }
    }
}

