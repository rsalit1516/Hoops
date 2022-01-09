using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;

namespace Hoops.Infrastructure.Interface
{
    public interface ISponsorRepository : IRepository<Sponsor>
    {
        IQueryable<Sponsor> GetAll(int companyId);
        Task<List<SponsorVM>> GetSeasonSponsors();
        bool IsSeasonSponsor(int seasonId, int sponsorProfileId);
        decimal GetSponsorBalance(int sponsorProfileId);

    }
}
