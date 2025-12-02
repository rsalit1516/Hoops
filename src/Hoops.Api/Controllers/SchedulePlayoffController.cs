using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Hoops.Core.Models;
using Hoops.Core.Interface;
using Hoops.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

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
        // [Route("GetSeasonGames")]
        [HttpGet("season/{seasonId}", Name = "GetSeasonGames")]
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


        // PUT: api/SchedulePlayoff/{id}
        // Updates an existing playoff game. "id" represents ScheduleNumber; GameNumber is taken from body.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSchedulePlayoff(int id, SchedulePlayoff schedulePlayoff)
        {
            _logger.LogInformation("Retrieving division standings");
            if (schedulePlayoff == null)
            {
                return BadRequest();
            }
            // Guard: route id should match body schedule number if provided
            if (id != 0 && schedulePlayoff.ScheduleNumber != 0 && id != schedulePlayoff.ScheduleNumber)
            {
                return BadRequest("Route id and body ScheduleNumber must match.");
            }

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

        // PUT: api/SchedulePlayoff/{scheduleNumber}/{gameNumber}
        // Updates an existing playoff game using composite keys
        [HttpPut("{scheduleNumber:int}/{gameNumber:int}")]
        public async Task<IActionResult> PutSchedulePlayoffByKeys(int scheduleNumber, int gameNumber, SchedulePlayoff schedulePlayoff)
        {
            if (schedulePlayoff == null)
            {
                return BadRequest();
            }

            // Load existing by composite keys to ensure we update the correct entity
            var existing = repository.GetByScheduleAndGameNo(scheduleNumber, gameNumber);
            if (existing == null)
            {
                return NotFound();
            }

            // Copy over updatable fields
            existing.LocationNumber = schedulePlayoff.LocationNumber;
            existing.GameDate = schedulePlayoff.GameDate;
            existing.GameTime = schedulePlayoff.GameTime;
            existing.VisitingTeam = schedulePlayoff.VisitingTeam;
            existing.HomeTeam = schedulePlayoff.HomeTeam;
            existing.Descr = schedulePlayoff.Descr;
            existing.VisitingTeamScore = schedulePlayoff.VisitingTeamScore;
            existing.HomeTeamScore = schedulePlayoff.HomeTeamScore;
            existing.DivisionId = schedulePlayoff.DivisionId;

            // Save modifications on the tracked entity
            await repository.SaveChangesAsync();
            return NoContent();
        }

        // POST: api/SchedulePlayoff
        // Creates a new playoff game. If GameNumber is 0, repository will assign next number for the ScheduleNumber.
        [HttpPost]
        public async Task<ActionResult<SchedulePlayoff>> PostSchedulePlayoff(SchedulePlayoff schedulePlayoff)
        {
            if (schedulePlayoff == null)
            {
                return BadRequest();
            }
            var created = repository.Insert(schedulePlayoff);
            await repository.SaveChangesAsync();
            // Return with a route pointing to season endpoint for convenience
            return CreatedAtAction(nameof(GetScheduleGame), new { id = created.GameNumber }, created);
        }

        // DELETE: api/SchedulePlayoff/{scheduleNumber}/{gameNumber}
        [HttpDelete("{scheduleNumber:int}/{gameNumber:int}")]
        public ActionResult DeleteSchedulePlayoff(int scheduleNumber, int gameNumber)
        {
            var existing = repository.GetByScheduleAndGameNo(scheduleNumber, gameNumber);
            if (existing == null)
            {
                return NotFound();
            }
            repository.Delete(existing);
            repository.SaveChanges();
            return NoContent();
        }

        // PUT: api/SchedulePlayoff/by-id/{schedulePlayoffId}
        // Updates an existing playoff game using primary key
        [HttpPut("by-id/{schedulePlayoffId:int}")]
        public async Task<IActionResult> PutSchedulePlayoffById(int schedulePlayoffId, SchedulePlayoff schedulePlayoff)
        {
            if (schedulePlayoff == null)
            {
                return BadRequest();
            }

            var existing = await _context.SchedulePlayoffs.FirstOrDefaultAsync(x => x.SchedulePlayoffId == schedulePlayoffId);
            if (existing == null)
            {
                return NotFound();
            }

            // Update fields
            existing.ScheduleNumber = schedulePlayoff.ScheduleNumber;
            existing.GameNumber = schedulePlayoff.GameNumber;
            existing.LocationNumber = schedulePlayoff.LocationNumber;
            existing.GameDate = schedulePlayoff.GameDate;
            existing.GameTime = schedulePlayoff.GameTime;
            existing.VisitingTeam = schedulePlayoff.VisitingTeam;
            existing.HomeTeam = schedulePlayoff.HomeTeam;
            existing.Descr = schedulePlayoff.Descr;
            existing.VisitingTeamScore = schedulePlayoff.VisitingTeamScore;
            existing.HomeTeamScore = schedulePlayoff.HomeTeamScore;
            existing.DivisionId = schedulePlayoff.DivisionId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool ScheduleGameExists(int id)
        {
            return _context.SchedulePlayoffs.Any(e => e.GameNumber == id);
        }


    }
}
