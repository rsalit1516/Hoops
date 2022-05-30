using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hoops.Infrastructure.Interface;
using Hoops.Core;
using Hoops.Core.Models;
using Hoops.Core.ViewModel;
using Microsoft.Extensions.Logging;

namespace Hoops.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class TeamController : ControllerBase
    {
        private readonly hoopsContext _context;
        private readonly ITeamRepository repository;
        private readonly ILogger<TeamController> _logger;

        public ITeamRepository Teams { get; set; }

        public TeamController(ITeamRepository repository, ILogger<TeamController> logger)
        {
            this.repository = repository;
            _logger = logger;
            _logger.LogDebug(1, "NLog injected into TeamTroller");
        }

        // GET: api/Team
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Team>>> GetTeams()
        {
            return await _context.Teams.ToListAsync();
        }

        // GET: api/Team/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Team>> GetTeam(int id)
        {
            var team = await _context.Teams.FindAsync(id);

            if (team == null)
            {
                return NotFound();
            }

            return team;
        }

        // PUT: api/Team/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTeam(int id, Team team)
        {
            _logger.LogInformation("Updating new team");
            _logger.LogInformation(team.TeamId.ToString());
            _logger.LogInformation(team.TeamColorId.ToString());
            if (id != team.TeamId)
            {
                return BadRequest();
            }
            repository.Update(team);
            //            _context.Entry(team).State = EntityState.Modified;

            try
            {
                await repository.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TeamExists(id))
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

        // POST: api/Team
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Team>> PostTeam(Team team)
        {
            _logger.LogInformation("Posting new team");
            // if (team.SeasonId == null)
            // {
            //     var div = _context.Divisions.FirstOrDefault(d => d.DivisionId == team.DivisionId);
            //     team.SeasonId = div.SeasonId;
            // }
            team.CompanyId = 1;
            repository.Insert(team);
            await repository.SaveChangesAsync();

            return CreatedAtAction("GetTeam", new { id = team.TeamId }, team);
        }

        // DELETE: api/Team/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Team>> DeleteTeam(int id)
        {
            var team = await _context.Teams.FindAsync(id);
            if (team == null)
            {
                return NotFound();
            }

            _context.Teams.Remove(team);
            await _context.SaveChangesAsync();

            return team;
        }

        private bool TeamExists(int id)
        {
            return _context.Teams.Any(e => e.TeamId == id);
        }
        /// <summary>
        /// Gets the teams for a season
        /// </summary>
        /// <param name="seasonId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetSeasonTeams/{seasonId}")]
        public IEnumerable<Team> GetSeasonTeams(int seasonId)
        {
            var test = new Team();
            var teams = new List<vmTeam>();

            var entityTeams = repository.GetSeasonTeams(seasonId);
            // foreach (var team in entityTeams)
            // {
            //     var t = ConvertRecordForTeamNumber(team);
            //     teams.Add(t);
            // }

            return entityTeams;
        }

    }
}
