using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;
using Hoops.Infrastructure.Interface;

namespace Hoops.Infrastructure.Interface
{
    public interface IWebContentRepository: IRepository<WebContent>
    {
        Task<IEnumerable<WebContentVm>> GetAllAsync(int companyId);
        Task<IEnumerable<WebContentVm>> GetActiveWebContentAsync(int companyId);
    }
}