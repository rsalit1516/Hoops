using System;
using Xunit;
using csbc_server.Infrastructure.Repository;
using Csbc.Infrastructure;
using Csbc.Entities;
using System.Linq;
using System.Threading.Tasks;

namespace csbc_server_test
{
    public class WebContentTypeTests
    {
        [Fact]
        public async void AddAsyncWebContentTypeTest1()
        {
            using (var db = new hoopsContext())
            {
                var repo = new WebContentTypeRepository(db);
                await DeleteAllAsync(repo);
                var found = db.WebContentTypes;
                if (!found.Any())
                {
                    var entity = new WebContentType
                    {
                        WebContentTypeDescription = "Meeting"
                    };
                    var actual = await repo.InsertAsync(entity);
                    await db.SaveChangesAsync();
                    Assert.True(actual != null);
                }
            }
        }
        [Fact]
        public async void AddAllAsyncWebContentTypeTest1()
        {
            using (var db = new hoopsContext())
            {
                var repo = new WebContentTypeRepository(db);
                await DeleteAllAsync(repo);
                var records = db.WebContentTypes;
                foreach (var record in records)
                {
                    repo.Delete(record.WebContentTypeId);
                }
                await db.SaveChangesAsync();

                var actual = repo.Insert(new WebContentType { WebContentTypeDescription = "Meeting" });
                actual = repo.Insert(new WebContentType { WebContentTypeDescription = "Event" });
                repo.Insert(new WebContentType { WebContentTypeDescription = "Season Info" });
                db.SaveChanges();
                Assert.True(records.Count() == 3);
            }
        }

        [Fact]
        public async void GetByWebContentTypeDescription()
        {
            using (var db = new hoopsContext())
            {
                var repo = new WebContentTypeRepository(db);
                var inserted = await repo.InsertAsync(new WebContentType { WebContentTypeDescription = "Test" });
                await db.SaveChangesAsync();
                var result = await repo.GetByDescriptionAsync("Test");
                Assert.True(result != null);
                await repo.DeleteAsync(result.WebContentTypeId);
            }
        }
                private async Task DeleteAllAsync(WebContentTypeRepository  repo)
        {
            var records = await repo.GetAllAsync();
            foreach (var record in records)
            {
                await repo.DeleteAsync(record.WebContentTypeId);
            }
        }
    }
}

