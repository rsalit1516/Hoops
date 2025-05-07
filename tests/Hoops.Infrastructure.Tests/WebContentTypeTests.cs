using Hoops.Core.Models;
using Hoops.Infrastructure.Repository;
using Hoops.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Hoops.Infrastructure.Tests
{
    public class WebContentTypeTest
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
        }

        [Fact]
        public async Task GetByWebContentTypeDescription()
        {

            var inserted = await repo.InsertAsync(new WebContentType { WebContentTypeDescription = "Test" });
            _ = await _context.SaveChangesAsync();
            var result = await repo.GetByDescriptionAsync("Test");
            Assert.True(result != null);
            await repo.DeleteAsync(result.WebContentTypeId);

        }


        [Fact]
        public async Task AddAsyncWebContentTypeTest1()
        {
            // await DeleteAllAsync(repo);
            var found = await repo.GetAllAsync();
            if (!found.Any())
            {
                var entity = new WebContentType
                {
                    WebContentTypeDescription = "Meeting"
                };
                var actual = await repo.InsertAsync(entity);
                await _context.SaveChangesAsync();
                Assert.True(actual != null);
            }

        }
        [Fact]
        public async Task AddAllAsyncWebContentTypeTest1()
        {
            // var repo = new WebContentTypeRepository(_context);
            await DeleteAllAsync(repo);
            var records = _context.WebContentTypes;
            foreach (var record in records)
            {
                repo.Delete(record.WebContentTypeId);
            }
            await _context.SaveChangesAsync();

            var actual = repo.Insert(new WebContentType { WebContentTypeDescription = "Meeting" });
            actual = repo.Insert(new WebContentType { WebContentTypeDescription = "Event" });
            repo.Insert(new WebContentType { WebContentTypeDescription = "Season Info" });
            _context.SaveChanges();
            Assert.True(records.Count() == 3);

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

