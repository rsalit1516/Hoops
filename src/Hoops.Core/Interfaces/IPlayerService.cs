using System.Threading.Tasks;
using Hoops.Core.Models;

namespace Hoops.Core.Interface
{
    public interface IPlayerService
    {
        /// <summary>
        /// Creates a new player registration for a person
        /// </summary>
        /// <param name="personId">The person ID to register as a player</param>
        /// <param name="seasonId">The season ID for registration</param>
        /// <returns>The created player with calculated division</returns>
        Task<Player> CreatePlayerRegistrationAsync(int personId, int seasonId);

        /// <summary>
        /// Updates an existing player registration
        /// </summary>
        /// <param name="player">The player with updated information</param>
        /// <returns>The updated player</returns>
        Task<Player> UpdatePlayerAsync(Player player);

        /// <summary>
        /// Gets a player by ID
        /// </summary>
        /// <param name="playerId">The player ID</param>
        /// <returns>The player</returns>
        Task<Player> GetPlayerByIdAsync(int playerId);

        /// <summary>
        /// Determines the appropriate division for a person based on birthdate and gender
        /// </summary>
        /// <param name="personId">The person ID</param>
        /// <param name="seasonId">The season ID</param>
        /// <returns>The division ID or null if no match found</returns>
        Task<int?> DetermineDivisionAsync(int personId, int seasonId);
    }
}
