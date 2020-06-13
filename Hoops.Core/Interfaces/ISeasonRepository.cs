using Hoops.Core.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Infrastructure.Interface;

namespace Csbc.Infrastructure.Interface
{
    public interface ISeasonRepository : IRepository<Season>
    {
        Season GetSeason(int companyId, int seasonId = 0);
        Task<Season> GetCurrentSeason(int companyId);
        int GetSeason(int companyId, string seasonDescription);
        IQueryable<Season> GetSeasons(int companyId);

        
        IEnumerable<Season> GetAll(int companyId);
    }
}
