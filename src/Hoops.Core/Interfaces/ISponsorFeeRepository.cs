using Hoops.Core.Models;
using System.Collections.Generic;
using Hoops.Core.Interface;

namespace Csbc.Infrastructure.Interface
{
    public interface ISponsorFeeRepository : IRepository<Season>
    {
        // Move to Sponsor Fee Repository
        List<SponsorFee> GetSeasonFees(int seasonId);
    }
}