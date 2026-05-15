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
        Task<List<SponsorWithProfile>> GetSeasonSponsorsAsync(int seasonId);
        bool IsSeasonSponsor(int seasonId, int sponsorProfileId);
        decimal GetSponsorBalance(int sponsorProfileId);
        Task<List<SponsorSeasonDto>> GetByProfileIdAsync(int sponsorProfileId);
        Task<Sponsor> CreateSeasonEntryAsync(Sponsor sponsor);
        Task<Sponsor> UpdateSeasonEntryAsync(Sponsor sponsor);
    }
}
