using Hoops.Infrastructure.Repository;

namespace Hoops.Test
{
    public class TestUtilities
    {
        internal async Task DeleteAllWebContentAsync(WebContentRepository repo)
        {
            var records = await repo.GetAllAsync();
            foreach (var record in records)
            {
                await repo.DeleteAsync(record.WebContentId);
            }
        }
    }
}
