using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Hoops.Core.Interface;
using Hoops.Infrastructure.Data;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;

namespace Hoops.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class TeamController : ControllerBase
    {
        private readonly ITeamRepository repository;
        private readonly ILogger<TeamController> _logger;

        public TeamController(ITeamRepository repository, ILogger<TeamController> logger)
        {
            this.repository = repository;
            _logger = logger;
            _logger.LogDebug(1, "NLog injected into TeamController");
        }

        // GET: api/Team
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Team>>> GetTeams()
        {
            var teams = await repository.GetAllAsync();
            return Ok(teams);
        }

        // GET: api/Team/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Team>> GetTeam(int id)
        {
            var team = await repository.GetByIdAsync(id);
            if (team == null)
            {
                return NotFound();
            }
            return Ok(team);
        }

        // PUT: api/Team/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTeam(int id, Team team)
        {
            _logger.LogInformation("Updating new team");
            if (id != team.TeamId)
            {
                return BadRequest();
            }
            repository.Update(team);
            try
            {
                await repository.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                var exists = await repository.GetByIdAsync(id) != null;
                if (!exists)
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
            repository.Insert(team);
            await repository.SaveChangesAsync();
            return CreatedAtAction("GetTeam", new { id = team.TeamId }, team);
        }

        // DELETE: api/Team/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Team>> DeleteTeam(int id)
        {
            var team = await repository.GetByIdAsync(id);
            if (team == null)
            {
                return NotFound();
            }
            repository.Delete(team);
            await repository.SaveChangesAsync();
            return Ok(team);
        }

        private bool TeamExists(int id)
        {
            return repository.GetByIdAsync(id) != null;
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
