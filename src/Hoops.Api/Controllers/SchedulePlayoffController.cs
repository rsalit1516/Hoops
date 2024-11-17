using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Hoops.Core.Models;
using Hoops.Core.Interface;
using Hoops.Infrastructure.Data;

namespace Hoops.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SchedulePlayoffController : ControllerBase
    {
        private readonly hoopsContext _context;
        private readonly ISchedulePlayoffRepository repository;
        private readonly ILogger<SchedulePlayoffController> _logger;

        public SchedulePlayoffController(ISchedulePlayoffRepository repository, ILogger<SchedulePlayoffController> logger)
        {
            _context = new hoopsContext();
            this.repository = repository;
            _logger = logger;
            _logger.LogDebug(1, "NLog injected into SchedulePlayoffController");
        }

        // GET: api/ScheduleGame
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SchedulePlayoff>>> GetScheduleGame()
        {
            return Ok(await repository.GetAllAsync());
        }

        // GET: api/ScheduleGame/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SchedulePlayoff>> GetScheduleGame(int id)
        {
            var scheduleGame = await _context.SchedulePlayoffs.FindAsync(id);

            if (scheduleGame == null)
            {
                return NotFound();
            }

            return scheduleGame;
        }

        // GET: api/GetSeasonGames/seasonId
        /// <summary>
        /// GetSeasonGames - get all games for the season
        /// </summary>
        /// <param name="seasonId"></param>
        /// <returns></returns>
        [Route("GetSeasonGames")]
        [HttpGet]
        public IActionResult GetSeasonGames(int seasonId)
        {
            _logger.LogInformation("Retrieving season games");
            if (seasonId == 0)
            {
                return BadRequest();
            }
            var games = repository.GetGamesBySeasonId(seasonId);
            return Ok(games);
        }

        // GET: api/GetSeasonGames/seasonId
        /// <summary>
        /// GetSeasonPlayoffGames - get all playoff games for the season
        /// </summary>
        /// <param name="seasonId"></param>
        /// <returns></returns>
        [Route("GetSeasonPlayoffGames")]
        [HttpGet]
        public IActionResult GetSeasonPlayoffGames(int seasonId)
        {
            _logger.LogInformation("Retrieving season playoff gamaaes");
            var games = repository.GetGamesBySeasonId(seasonId);
            return Ok(games);
        }


        // PUT: api/ScheduleGame/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutScheduleGame(int id, SchedulePlayoff schedulePlayoff)
        {
            _logger.LogInformation("Retrieving division standings");
            // TODO: Fix the put !!!
            // if (id != schedulePlayoff.SchedulePlayoffId)
            // {
            //     return BadRequest();
            // }

            repository.Update(schedulePlayoff);

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
            _context.ScheduleGames.Add(scheduleGame);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetScheduleGame", new { id = scheduleGame.ScheduleGamesId }, scheduleGame);
        }

        // DELETE: api/ScheduleGame/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ScheduleGame>> DeleteScheduleGame(int id)
        {
            var scheduleGame = await _context.ScheduleGames.FindAsync(id);
            if (scheduleGame == null)
            {
                return NotFound();
            }

            _context.ScheduleGames.Remove(scheduleGame);
            await _context.SaveChangesAsync();

            return scheduleGame;
        }

        private bool ScheduleGameExists(int id)
        {
            return _context.ScheduleGames.Any(e => e.ScheduleGamesId == id);
        }


    }
}
