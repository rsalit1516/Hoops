using System;
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

        /// <summary>
        /// Create a new player registration
        /// </summary>
        /// <param name="player">The player data</param>
        /// <returns>The created player</returns>
        [HttpPost]
        public IActionResult PostPlayer(Player player)
        {
            try
            {
                // Treat 0 as null for optional foreign keys
                if (player.TeamId.HasValue && player.TeamId.Value == 0)
                {
                    player.TeamId = null;
                }
                if (player.DivisionId.HasValue && player.DivisionId.Value == 0)
                {
                    player.DivisionId = null;
                }
                if (player.CoachId.HasValue && player.CoachId.Value == 0)
                {
                    player.CoachId = null;
                }
                if (player.SponsorId.HasValue && player.SponsorId.Value == 0)
                {
                    player.SponsorId = null;
                }
                if (player.RefundBatchId.HasValue && player.RefundBatchId.Value == 0)
                {
                    player.RefundBatchId = null;
                }
                if (player.ShoppingCartId.HasValue && player.ShoppingCartId.Value == 0)
                {
                    player.ShoppingCartId = null;
                }

                // Set creation date if not provided
                if (!player.CreatedDate.HasValue)
                {
                    player.CreatedDate = DateTime.Now;
                }

                var createdPlayer = _playerRepository.Insert(player);
                _playerRepository.SaveChanges();

                return CreatedAtAction("GetPlayer", new { id = createdPlayer.PlayerId }, createdPlayer);
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException ex)
            {
                return Problem(
                    title: "Failed to create player",
                    detail: ex.InnerException?.Message ?? ex.Message,
                    statusCode: StatusCodes.Status409Conflict);
            }
            catch (Exception ex)
            {
                return Problem(
                    title: "Unexpected error creating player",
                    detail: ex.Message,
                    statusCode: StatusCodes.Status500InternalServerError);
            }
        }

        /// <summary>
        /// Update an existing player registration
        /// </summary>
        /// <param name="id">The player ID</param>
        /// <param name="player">The updated player data</param>
        /// <returns>The updated player</returns>
        [HttpPut("{id}")]
        public IActionResult PutPlayer(int id, Player player)
        {
            try
            {
                if (id != player.PlayerId)
                {
                    return BadRequest(new ProblemDetails
                    {
                        Title = "Invalid player id",
                        Detail = $"Route id {id} does not match payload PlayerId {player.PlayerId}",
                        Status = StatusCodes.Status400BadRequest
                    });
                }

                // Treat 0 as null for optional foreign keys
                if (player.TeamId.HasValue && player.TeamId.Value == 0)
                {
                    player.TeamId = null;
                }
                if (player.DivisionId.HasValue && player.DivisionId.Value == 0)
                {
                    player.DivisionId = null;
                }
                if (player.CoachId.HasValue && player.CoachId.Value == 0)
                {
                    player.CoachId = null;
                }
                if (player.SponsorId.HasValue && player.SponsorId.Value == 0)
                {
                    player.SponsorId = null;
                }
                if (player.RefundBatchId.HasValue && player.RefundBatchId.Value == 0)
                {
                    player.RefundBatchId = null;
                }
                if (player.ShoppingCartId.HasValue && player.ShoppingCartId.Value == 0)
                {
                    player.ShoppingCartId = null;
                }

                var updatedPlayer = _playerRepository.Update(player);
                _playerRepository.SaveChanges();
                return Ok(updatedPlayer);
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException ex)
            {
                return Problem(
                    title: "Failed to update player",
                    detail: ex.InnerException?.Message ?? ex.Message,
                    statusCode: StatusCodes.Status409Conflict);
            }
            catch (Exception ex)
            {
                var existingPlayer = _playerRepository.GetById(id);
                if (existingPlayer == null)
                {
                    return NotFound();
                }

                return Problem(
                    title: "Unexpected error updating player",
                    detail: ex.Message,
                    statusCode: StatusCodes.Status500InternalServerError);
            }
        }

        /// <summary>
        /// Delete a player registration
        /// </summary>
        /// <param name="id">The player ID</param>
        /// <returns>Success status</returns>
        [HttpDelete("{id}")]
        public IActionResult DeletePlayer(int id)
        {
            try
            {
                var player = _playerRepository.GetById(id);
                if (player == null)
                {
                    return NotFound();
                }

                var deleted = _playerRepository.DeleteById(id);
                if (!deleted)
                {
                    return Problem(
                        title: "Delete failed",
                        detail: "Unable to delete the player",
                        statusCode: StatusCodes.Status500InternalServerError);
                }

                return Ok();
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException)
            {
                return Conflict(new ProblemDetails
                {
                    Title = "Cannot delete player",
                    Detail = "The player has related records. Remove dependencies first.",
                    Status = StatusCodes.Status409Conflict
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ProblemDetails
                {
                    Title = "Delete failed",
                    Detail = ex.Message,
                    Status = StatusCodes.Status500InternalServerError
                });
            }
        }
    }
}
