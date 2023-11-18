using System;
using Xunit;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Infrastructure.Repository;
using Hoops.Core.Models;
using Hoops.Core;
using Microsoft.EntityFrameworkCore;

namespace csbc_server_test
{
    public class WebContentsTest
    {
             private readonly hoopsContext _context;

        public WebContentRepository repo;
        public WebContentTypeRepository repoType;

                public WebContentsTest()
        {
                   var options = new DbContextOptionsBuilder<hoopsContext>()
            .UseInMemoryDatabase(databaseName: "hoops")
            .Options;
            _context = new hoopsContext(options);
            repo = new WebContentRepository(_context);
repoType = new WebContentTypeRepository(_context);

            Task task = CreateData();
        }

        [Fact]
        public async void GetActiveWebContentAsyncTest1()
        {
            var actual = await repo.GetActiveWebContentAsync(1);
            Assert.True(actual.Count() == 3);
        }
        [Fact]
        public async void AddAllAsyncWebContentTypeTest()
        {
                var seasonInfo = await repoType.GetByDescriptionAsync("Season Info");
                var meeting = await repoType.GetByDescriptionAsync("Meeting");
                // var repo = new WebContentRepository(db);
                await DeleteAllAsync(repo);
                
                await repo.InsertAsync(new WebContent
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
                    Body = "I ain't go no body",
                    ExpirationDate = DateTime.Now.AddDays(30)
                });

                await repo.InsertAsync(new WebContent
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
                    Body = "I ain't go no body",
                    ExpirationDate = DateTime.Now.AddDays(30)
                });
                await repo.InsertAsync(new WebContent
                {
                    // WebContentId
                    CompanyId = 1,
                    Page = "1",
                    WebContentTypeId = meeting.WebContentTypeId,
                    Title = "Meeting",
                    ContentSequence = 1,
                    SubTitle = "Meet by the school",
                    Location = "Mullins Hall",
                    DateAndTime = "7PM",
                    Body = "Meeting info",
                    ExpirationDate = DateTime.Now.AddDays(30)
                });
                await repo.InsertAsync(new WebContent
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
                    Body = "I ain't go no body",
                    ExpirationDate = DateTime.Now.AddDays(-3)
                });

                await _context.SaveChangesAsync();
                Assert.True(_context.WebContents.Count() == 4);
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
                await repo.InsertAsync(new WebContent
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
                    Body = "I ain't go no body",
                    ExpirationDate = DateTime.Now.AddDays(30)
                });

                await repo.InsertAsync(new WebContent
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
                    Body = "I ain't go no body",
                    ExpirationDate = DateTime.Now.AddDays(30)
                });
                await repo.InsertAsync(new WebContent
                {
                    // WebContentId
                    CompanyId = 1,
                    Page = "1",
                    WebContentTypeId = meeting.WebContentTypeId,
                    Title = "Meeting",
                    ContentSequence = 1,
                    SubTitle = "Meet by the school",
                    Location = "Mullins Hall",
                    DateAndTime = "7PM",
                    Body = "Meeting info",
                    ExpirationDate = DateTime.Now.AddDays(30)
                });
                await repo.InsertAsync(new WebContent
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
                    Body = "I ain't go no body",
                    ExpirationDate = DateTime.Now.AddDays(-3)
                });

                await db.SaveChangesAsync();
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
