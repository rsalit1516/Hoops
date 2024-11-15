using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;

namespace Hoops.Core.Interface
{
    public interface ISponsorRepository : IRepository<Sponsor>
    {
        IQueryable<Sponsor> GetAll(int companyId);
        IQueryable<SponsorWithProfile> GetSeasonSponsors(int seasonId);
        Task<List<SponsorWithProfile>> GetSeasonSponsorsAsync(int seasonId);
        bool IsSeasonSponsor(int seasonId, int sponsorProfileId);
        decimal GetSponsorBalance(int sponsorProfileId);

    }
}
