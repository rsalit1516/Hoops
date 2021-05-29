using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hoops.Infrastructure.Interface;
using Hoops.Core.Models;
using Hoops.Core;

namespace Hoops.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScheduleGameController : ControllerBase
    {
        private readonly hoopsContext _context;
        private readonly IScheduleGameRepository repository;
        public ScheduleGameController(IScheduleGameRepository repository)
        {
            // _context = context;

            this.repository = repository;
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
            var scheduleGame = await _context.ScheduleGames.FindAsync(id);

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
            return Ok(repository.GetSeasonGamesAsync(seasonId));
        }


        ///
        /// GET: api/GetStandings/divisionId
        [Route("GetStandings")]
        [HttpGet]
        public IActionResult GetStandings(int divisionId)
        {
            return Ok(repository.GetStandings(divisionId));
        }

        // PUT: api/ScheduleGame/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutScheduleGame(int id, ScheduleGame scheduleGame)
        {
            if (id != scheduleGame.ScheduleGamesId)
            {
                return BadRequest();
            }

            _context.Entry(scheduleGame).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
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
