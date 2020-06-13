using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hoops.Core.Entities;

namespace Hoops.Infrastructure.Interface
{
    public interface ISponsorRepository : IRepository<Sponsor>
    {
        IQueryable<Sponsor> GetAll(int companyId);
        IQueryable<Sponsor> GetSeasonSponsors(int seasonId);
        bool IsSeasonSponsor(int seasonId, int sponsorProfileId);
        decimal GetSponsorBalance(int sponsorProfileId);

    }
}
