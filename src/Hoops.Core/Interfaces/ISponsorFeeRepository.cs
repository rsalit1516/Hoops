using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Core.ViewModels;

namespace Hoops.Core.Interface
{
    public interface ISponsorFeeRepository
    {
        Task<List<SponsorFeeDto>> GetAllAsync();
    }
}
