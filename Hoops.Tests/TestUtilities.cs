using Hoops.Infrastructure.Repository;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

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
