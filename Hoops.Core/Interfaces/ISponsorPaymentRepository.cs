using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hoops.Core.Models;

namespace Hoops.Infrastructure.Interface
{
    public interface ISponsorPaymentRepository : IRepository<SponsorPayment>
    {
        List<SponsorPayment> GetSponsorPayments(int sponsorProfileId);
        decimal GetTotalPayments(int sponsorProfileId);
    }
}
