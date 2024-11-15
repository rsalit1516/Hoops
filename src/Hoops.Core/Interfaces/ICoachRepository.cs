using System.Linq;
using Hoops.Core.Models;
using System.Data;

namespace Hoops.Core.Interface
{
    public interface ICoachRepository : IRepository<Coach>
    {
        IQueryable<VwCoach> GetSeasonCoaches(int seasonId);
       // DataTable GetCoaches(int seasonId);
        VwCoach GetCoach(int id);
        IQueryable<VwCoach> GetCoachVolunteers(int companyId, int seasonId);
        Coach GetCoachForSeason(int seasonId, int PersonId);
    }
}
