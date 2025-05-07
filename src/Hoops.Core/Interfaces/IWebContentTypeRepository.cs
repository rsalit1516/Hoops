using System.Threading.Tasks;
using Hoops.Core.Models;

namespace Hoops.Core.Interface
{
    public interface IWebContentTypeRepository : IRepository<WebContentType>
    {
        Task<WebContentType> GetByDescriptionAsync(string webContentType);
    }
}
