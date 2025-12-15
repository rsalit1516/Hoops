using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;

namespace csbc_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlayerController : ControllerBase
    {
        private readonly IPlayerRepository _playerRepository;

        public PlayerController(IPlayerRepository playerRepository)
        {
            _playerRepository = playerRepository;
        }

        /// <summary>
        /// Get players for a season, optionally filtered by division
        /// </summary>
        /// <param name="seasonId">The season ID</param>
        /// <param name="divisionId">Optional division ID to filter by</param>
        /// <returns>List of players</returns>
        [HttpGet("season/{seasonId}")]
        public IActionResult GetPlayersBySeason(int seasonId, [FromQuery] int? divisionId = null)
        {
            var players = _playerRepository.GetDraftListPlayers(seasonId, divisionId);
            return Ok(players);
        }

        /// <summary>
        /// Get a player by ID
        /// </summary>
        /// <param name="id">The player ID</param>
        /// <returns>Player details</returns>
        [HttpGet("{id}")]
        public IActionResult GetPlayer(int id)
        {
            var player = _playerRepository.GetById(id);
            if (player == null)
            {
                return NotFound();
            }
            return Ok(player);
        }

        /// <summary>
        /// Get a player by person ID and season ID
        /// </summary>
        /// <param name="personId">The person ID</param>
        /// <param name="seasonId">The season ID</param>
        /// <returns>Player details</returns>
        [HttpGet("person/{personId}/season/{seasonId}")]
        public IActionResult GetPlayerByPersonAndSeason(int personId, int seasonId)
        {
            var player = _playerRepository.GetPlayerByPersonAndSeasonId(personId, seasonId);
            if (player == null || player.PlayerId == 0)
            {
                return NotFound();
            }
            return Ok(player);
        }
    }
}
