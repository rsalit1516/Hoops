using System.Collections.Generic;
using Hoops.Core.Models;

namespace Hoops.Core.Interface
{
    public interface ISponsorPaymentRepository : IRepository<SponsorPayment>
    {
        List<SponsorPayment> GetSponsorPayments(int sponsorProfileId);
        decimal GetTotalPayments(int sponsorProfileId);
    }
}
