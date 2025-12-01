using Microsoft.AspNetCore.Mvc;
using Hoops.Core.Models;
using Hoops.Core.Interface;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace Hoops.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlayersController : ControllerBase
    {
        private readonly IPlayerRepository _repository;
        private readonly IPlayerService _playerService;
        private readonly ILogger<PlayersController> _logger;

        public PlayersController(
            IPlayerRepository repository,
            IPlayerService playerService,
            ILogger<PlayersController> logger)
        {
            _repository = repository;
            _playerService = playerService;
            _logger = logger;
        }

        /// <summary>
        /// GET: api/Players/5
        /// Gets a player by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<Player>> GetPlayer(int id)
        {
            _logger.LogInformation("Retrieving player with ID {PlayerId}", id);

            try
            {
                var player = await _playerService.GetPlayerByIdAsync(id);
                return Ok(player);
            }
            catch (System.InvalidOperationException)
            {
                return NotFound();
            }
        }

        /// <summary>
        /// GET: api/Players/Person/5
        /// Gets a player by person ID
        /// </summary>
        [HttpGet("Person/{personId}")]
        public ActionResult<Player> GetPlayerByPersonId(int personId)
        {
            _logger.LogInformation("Retrieving player for person ID {PersonId}", personId);

            var player = _repository.GetByPersonId(personId);
            if (player == null || player.PlayerId == 0)
            {
                return NotFound();
            }

            return Ok(player);
        }

        /// <summary>
        /// GET: api/Players/Person/5/Season/10
        /// Gets a player by person ID and season ID
        /// </summary>
        [HttpGet("Person/{personId}/Season/{seasonId}")]
        public ActionResult<Player> GetPlayerByPersonAndSeason(int personId, int seasonId)
        {
            _logger.LogInformation(
                "Retrieving player for person ID {PersonId} and season ID {SeasonId}",
                personId,
                seasonId);

            var player = _repository.GetPlayerByPersonAndSeasonId(personId, seasonId);
            if (player == null || player.PlayerId == 0)
            {
                return NotFound();
            }

            return Ok(player);
        }

        /// <summary>
        /// POST: api/Players
        /// Creates a new player registration
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<Player>> CreatePlayer(Player player)
        {
            _logger.LogInformation(
                "Creating player registration for person ID {PersonId} in season {SeasonId}",
                player.PersonId,
                player.SeasonId);

            if (player.SeasonId == null || player.SeasonId == 0)
            {
                return BadRequest("SeasonId is required");
            }

            try
            {
                // If division is not set, determine it automatically
                if (player.DivisionId == null || player.DivisionId == 0)
                {
                    var divisionId = await _playerService.DetermineDivisionAsync(
                        player.PersonId,
                        player.SeasonId.Value);
                    player.DivisionId = divisionId;
                }

                // Set default values if not provided
                player.CompanyId ??= 1;
                player.CreatedDate ??= System.DateTime.Now;

                var createdPlayer = _repository.Insert(player);
                _repository.SaveChanges();

                return CreatedAtAction(
                    nameof(GetPlayer),
                    new { id = createdPlayer.PlayerId },
                    createdPlayer);
            }
            catch (System.InvalidOperationException ex)
            {
                _logger.LogError(ex, "Error creating player registration");
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// PUT: api/Players/5
        /// Updates an existing player registration
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePlayer(int id, Player player)
        {
            if (id != player.PlayerId)
            {
                return BadRequest("Player ID mismatch");
            }

            _logger.LogInformation("Updating player with ID {PlayerId}", id);

            try
            {
                var updatedPlayer = await _playerService.UpdatePlayerAsync(player);
                return Ok(updatedPlayer);
            }
            catch (System.InvalidOperationException)
            {
                return NotFound();
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateConcurrencyException)
            {
                if (_repository.GetById(id) == null)
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        /// <summary>
        /// DELETE: api/Players/5
        /// Deletes a player registration
        /// </summary>
        [HttpDelete("{id}")]
        public ActionResult<Player> DeletePlayer(int id)
        {
            _logger.LogInformation("Deleting player with ID {PlayerId}", id);

            var player = _repository.GetById(id);
            if (player == null)
            {
                return NotFound();
            }

            _repository.Delete(player);
            _repository.SaveChanges();

            return Ok(player);
        }
    }
}
