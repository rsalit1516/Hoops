using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Core.ViewModels;

namespace Hoops.Infrastructure.Repository
{
    // SponsorFee table does not exist in production; fees are a fixed set.
    public class SponsorFeeRepository : ISponsorFeeRepository
    {
        private static readonly List<SponsorFeeDto> _fees = new()
        {
            new SponsorFeeDto { SponsorFeeId = 1, FeeName = "Standard",    Amount = 225.00m },
            new SponsorFeeDto { SponsorFeeId = 2, FeeName = "Discount",    Amount = 112.50m },
            new SponsorFeeDto { SponsorFeeId = 3, FeeName = "Scholarship", Amount = 0m },
        };

        public Task<List<SponsorFeeDto>> GetAllAsync() => Task.FromResult(_fees);
    }
}
