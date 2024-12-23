using Hoops.Core.Models;
using Hoops.Core.Interface;
using Microsoft.EntityFrameworkCore;
using Hoops.Infrastructure.Data;
// using System.Data.Entity;

namespace Hoops.Infrastructure.Repository
{
    public class WebContentTypeRepository(hoopsContext context) : EFRepository<WebContentType>(context), IWebContentTypeRepository
    {
        public async Task<WebContentType?> GetByDescriptionAsync(string webContentType) => await context.WebContentTypes.FirstOrDefaultAsync(w => w.WebContentTypeDescription == webContentType);

    }
}
