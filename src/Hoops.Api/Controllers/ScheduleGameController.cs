using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;
using Hoops.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace Hoops.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScheduleGameController : ControllerBase
    {
        private readonly IScheduleGameRepository repository;
        private readonly ILogger<ScheduleGameController> _logger;
        private readonly ISeasonService _seasonService;

        public ScheduleGameController(
            IScheduleGameRepository repository,
            ILogger<ScheduleGameController> logger,
            ISeasonService seasonService
        )
        {
            this.repository = repository;
            _logger = logger;
            _seasonService = seasonService;
            _logger.LogDebug(1, "NLog injected into ScheduleGameController");
        }

        // GET: api/ScheduleGame
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ScheduleGame>>> GetScheduleGame()
        {
            return Ok(await repository.GetAllAsync());
        }

        // GET: api/ScheduleGame/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ScheduleGame>> GetScheduleGame(int id)
        {
            var scheduleGame = await repository.GetByIdAsync(id);
            if (scheduleGame == null)
            {
                return NotFound();
            }
            return Ok(scheduleGame);
        }

        // GET: api/GetSeasonGames/seasonId
        /// <summary>
        /// GetSeasonGames - get all games for the season
        /// </summary>
        /// <param name="seasonId"></param>
        /// <returns></returns>
        [Route("GetSeasonGames")]
        [HttpGet]
        public async Task<IActionResult> GetSeasonGames(int seasonId)
        {
            _logger.LogInformation("Retrieving season games for seasonId: {SeasonId}", seasonId);
            
            if (seasonId <= 0)
            {
                return BadRequest("Season ID must be greater than 0");
            }

            try
            {
                var games = await repository.GetSeasonGamesAsync(seasonId);
                return Ok(games);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving season games for seasonId: {SeasonId}", seasonId);
                return StatusCode(500, "An error occurred while retrieving season games");
            }
        }

        ///
        /// GET: api/GetStandings?seasonId=123&divisionId=456
        // [Route("GetStandings")]
        [HttpGet("GetStandings/{seasonId:int}/{divisionId:int}")]
        public IActionResult GetStandings(int seasonId, int divisionId)
        {
            _logger.LogInformation("Retrieving division standings for seasonId: {SeasonId} divisionId: {DivisionId}", seasonId, divisionId);
            
            if (divisionId <= 0)
            {
                return BadRequest("Division ID must be greater than 0");
            }
            
            if (seasonId <= 0)
            {
                return BadRequest("Season ID must be greater than 0");
            }

            try
            {
                var standings = repository.GetStandings(seasonId, divisionId);
                if (standings == null || !standings.Any())
                {
                    _logger.LogInformation("No standings found for season {SeasonId} division {DivisionId}", seasonId, divisionId);
                    return Ok(new List<ScheduleStandingsVM>());
                }
                
                return Ok(standings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving standings for seasonId: {SeasonId} divisionId: {DivisionId}", seasonId, divisionId);
                return StatusCode(500, "An error occurred while retrieving standings");
            }
        }

        // PUT: api/ScheduleGame/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutScheduleGame(int id, ScheduleGame scheduleGame)
        {
            _logger.LogInformation("Updating schedule game");
            if (id != scheduleGame.ScheduleGamesId)
            {
                return BadRequest();
            }

            repository.Update(scheduleGame);

            try
            {
                await repository.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ScheduleGameExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/ScheduleGame
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<ScheduleGame>> PostScheduleGame(ScheduleGame scheduleGame)
        {
            repository.Add(scheduleGame);
            await repository.SaveChangesAsync();

            return CreatedAtAction(
                "GetScheduleGame",
                new { id = scheduleGame.ScheduleGamesId },
                scheduleGame
            );
        }

        // DELETE: api/ScheduleGame/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ScheduleGame>> DeleteScheduleGame(int id)
        {
            var scheduleGame = await repository.GetByIdAsync(id);
            if (scheduleGame == null)
            {
                return NotFound();
            }
            repository.Delete(scheduleGame);
            await repository.SaveChangesAsync();
            return Ok(scheduleGame);
        }

        private bool ScheduleGameExists(int id)
        {
            return repository.Exists(id);
        }
    }
}
