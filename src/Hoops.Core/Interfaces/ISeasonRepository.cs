using Hoops.Core.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hoops.Core.Interface
{
    public interface ISeasonRepository : IRepository<Season>
    {
        Season GetSeason(int companyId, int seasonId = 0);
        Task<Season> GetCurrentSeason(int companyId);
        int GetSeason(int companyId, string seasonDescription);
        IQueryable<Season> GetSeasons(int companyId);

        
        // IEnumerable<Season> GetAll(int companyId);
        Task<List<Season>> GetAllAsync(int companyId);
    }
}
