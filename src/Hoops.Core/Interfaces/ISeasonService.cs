using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Core.Models;

namespace Hoops.Core.Interface
{
    public interface ISeasonService
    {
        /// <summary>
        /// Returns the current active season for a company, or throws if not found.
        /// </summary>
        Task<Season> GetCurrentSeasonAsync(int companyId);

        /// <summary>
        /// Gets all seasons
        /// </summary>
        Task<IEnumerable<Season>> GetAllSeasonsAsync();
        /// <summary>
        /// Gets all seasons for a specific company
        /// </summary>
        Task<IEnumerable<Season>> GetAllSeasonsAsync(int companyId);

        // Aggregate Root Methods
        Task<Division> AddDivisionToSeason(int seasonId, Division division);
        Task<Team> AddTeamToSeason(int seasonId, Team team);
    }
}
