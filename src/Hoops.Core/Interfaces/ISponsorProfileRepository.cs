#nullable enable
using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;

namespace Hoops.Core.Interface
{
    public interface ISponsorProfileRepository : IRepository<SponsorProfile>
    {
        Task<List<SponsorProfileListItemDto>> GetAllWithLastSeasonAsync(int companyId);
        Task<SponsorProfileDetailDto?> GetDetailByIdAsync(int id);
        Task<SponsorProfile> CreateProfileAsync(SponsorProfile profile);
        Task<SponsorProfile> UpdateProfileAsync(SponsorProfile profile);
    }
}
