using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hoops.Core.Models;

namespace Hoops.Infrastructure.Interface
{
    public interface IDivisionRepository : IRepository<Division>
    {
        IQueryable<VwDivision> LoadDivisions(int seasonId);
        IQueryable<Division> GetDivisions(int seasonId);
        Task<IEnumerable<Division>> GetSeasonDivisionsAsync(int seasonId);
        int GetPlayerDivision(int companyId, int seasonId, int peopleId);
    }
}
