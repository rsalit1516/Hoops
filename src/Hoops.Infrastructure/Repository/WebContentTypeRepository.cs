using Hoops.Core.Models;
using Csbc.Infrastructure;
using Hoops.Infrastructure.Interface;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Core;
// using System.Data.Entity;

namespace Hoops.Infrastructure.Repository
{
    public class WebContentTypeRepository : EFRepository<WebContentType>, IWebContentTypeRepository
    {

        public WebContentTypeRepository(hoopsContext context) : base(context) { }

        public async Task<WebContentType> GetByDescriptionAsync(string webContentType) => await context.WebContentTypes.FirstOrDefaultAsync(w => w.WebContentTypeDescription == webContentType);

    }
}
