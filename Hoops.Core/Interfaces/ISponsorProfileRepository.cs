using Hoops.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hoops.Infrastructure.Interface
{
    public interface ISponsorProfileRepository : IRepository<SponsorProfile>
    {
        //List<SponsorPayment> GetSponsorPayments(int sponsorProfileId);
        //decimal GetTotalPayments(int sponsorProfileId);
    }
}
