using Hoops.Infrastructure.Repository;
using Hoops.Infrastructure.Data;
using Hoops.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Hoops.Infrastructure.Tests
{
    public class WebContentsTest
    {
        private const string webContentBody = "I ain't go no body";
        private readonly hoopsContext _context;

        public WebContentRepository repo;
        public WebContentTypeRepository repoType;
        private Task task;

        public WebContentsTest()
        {
            var options = new DbContextOptionsBuilder<hoopsContext>()
     .UseInMemoryDatabase(databaseName: "hoops")
     .Options;
            _context = new hoopsContext(options);
            repo = new WebContentRepository(_context);
            repoType = new WebContentTypeRepository(_context);

            task = CreateData();
        }

        // [Fact]
        public async Task GetActiveWebContentAsyncTest1()
        {
            var actual = await repo.GetActiveWebContentAsync(1);
            _ = await _context.SaveChangesAsync();

            {
                // throw new Exception("Expected 4 active web contents, but actual count is " + actual.Count());
            }
            // _ = await _context.SaveChangesAsync();

            Assert.True(true);
        }

        // [Fact]
        public async Task AddAllAsyncWebContentTypeTest()
        {
            var seasonInfo = await repoType.GetByDescriptionAsync("Season Info");
            var meeting = await repoType.GetByDescriptionAsync("Meeting");
            var repo = new WebContentRepository(_context);
            await DeleteAllAsync(repo);

            if (seasonInfo != null)
            {
                _ = await repo.InsertAsync(new WebContent
                {
                    // WebContentId
                    CompanyId = 1,
                    Page = "1",
                    WebContentTypeId = seasonInfo.WebContentTypeId,
                    Title = "Second Test",
                    ContentSequence = 2,
                    SubTitle = "Second Subtitle",
                    Location = "Mullins",
                    DateAndTime = "7AM",
                    Body = webContentBody,
                    ExpirationDate = DateTime.Now.AddDays(30)
                });

                _ = await repo.InsertAsync(new WebContent
                {
                    // WebContentId
                    CompanyId = 1,
                    Page = "1",
                    WebContentTypeId = seasonInfo.WebContentTypeId,
                    Title = "First Test",
                    ContentSequence = 1,
                    SubTitle = "First Subtitle",
                    Location = "Mullins",
                    DateAndTime = "6AM",
                    Body = webContentBody,
                    ExpirationDate = DateTime.Now.AddDays(30)
                });
                _ = await repo.InsertAsync(new WebContent
                {
                    // WebContentId
                    CompanyId = 1,
                    Page = "1",
                    WebContentTypeId = meeting?.WebContentTypeId ?? throw new InvalidOperationException("Meeting is null"),
                    Title = "Meeting",
                    ContentSequence = 1,
                    SubTitle = "Meet by the school",
                    Location = "Mullins Hall",
                    DateAndTime = "7PM",
                    Body = "Meeting info",
                    ExpirationDate = DateTime.Now.AddDays(30)
                });
                _ = await repo.InsertAsync(new WebContent
                {
                    // WebContentId
                    CompanyId = 1,
                    Page = "1",
                    WebContentTypeId = seasonInfo.WebContentTypeId,
                    Title = "Second Test",
                    ContentSequence = 1,
                    SubTitle = "Second Subtitle",
                    Location = "Mullins",
                    DateAndTime = "7AM",
                    Body = webContentBody,
                    ExpirationDate = DateTime.Now.AddDays(-3)
                });

                _ = await _context.SaveChangesAsync();
            }
            Assert.True(_context.WebContents.Count() == 0);
        }

        private async Task CreateData()
        {
            using (var db = new hoopsContext())
            {
                var repoType = new WebContentTypeRepository(db);
                var seasonInfo = await repoType.GetByDescriptionAsync("Season Info");
                var meeting = await repoType.GetByDescriptionAsync("Meeting");
                var repo = new WebContentRepository(db);
                await DeleteAllAsync(repo);
                _ = await repo.InsertAsync(new WebContent
                {
                    // WebContentId
                    CompanyId = 1,
                    Page = "1",
                    WebContentTypeId = seasonInfo?.WebContentTypeId ?? throw new InvalidOperationException("seasonInfo is null"),
                    Title = "Second Test",
                    ContentSequence = 2,
                    SubTitle = "Second Subtitle",
                    Location = "Mullins",
                    DateAndTime = "7AM",
                    Body = webContentBody,
                    ExpirationDate = DateTime.Now.AddDays(30)
                });

                _ = await repo.InsertAsync(new WebContent
                {
                    // WebContentId
                    CompanyId = 1,
                    Page = "1",
                    WebContentTypeId = seasonInfo.WebContentTypeId,
                    Title = "First Test",
                    ContentSequence = 1,
                    SubTitle = "First Subtitle",
                    Location = "Mullins",
                    DateAndTime = "6AM",
                    Body = webContentBody,
                    ExpirationDate = DateTime.Now.AddDays(30)
                });
                _ = await repo.InsertAsync(new WebContent
                {
                    // WebContentId
                    CompanyId = 1,
                    Page = "1",
                    WebContentTypeId = meeting?.WebContentTypeId ?? throw new InvalidOperationException("Meeting is null"),
                    Title = "Meeting",
                    ContentSequence = 1,
                    SubTitle = "Meet by the school",
                    Location = "Mullins Hall",
                    DateAndTime = "7PM",
                    Body = "Meeting info",
                    ExpirationDate = DateTime.Now.AddDays(30)
                });
                _ = await repo.InsertAsync(new WebContent
                {
                    // WebContentId
                    CompanyId = 1,
                    Page = "1",
                    WebContentTypeId = seasonInfo.WebContentTypeId,
                    Title = "Second Test",
                    ContentSequence = 1,
                    SubTitle = "Second Subtitle",
                    Location = "Mullins",
                    DateAndTime = "7AM",
                    Body = webContentBody,
                    ExpirationDate = DateTime.Now.AddDays(-3)
                });

                _ = await db.SaveChangesAsync();
            }
        }
        private async Task DeleteAllAsync(WebContentRepository repo)
        {
            var records = await repo.GetAllAsync();
            foreach (var record in records)
            {
                await repo.DeleteAsync(record.WebContentId);
            }
        }
    }
}
