using Hoops.Core.Models;
using Hoops.Core.Interface;
using Microsoft.EntityFrameworkCore;
using Hoops.Infrastructure.Data;
// using System.Data.Entity;

namespace Hoops.Infrastructure.Repository
{
    public class WebContentTypeRepository : EFRepository<WebContentType>, IWebContentTypeRepository
    {

        public WebContentTypeRepository(hoopsContext context) : base(context) { }

        public async Task<WebContentType> GetByDescriptionAsync(string webContentType) => await context.WebContentTypes.FirstOrDefaultAsync(w => w.WebContentTypeDescription == webContentType);

    }
}
