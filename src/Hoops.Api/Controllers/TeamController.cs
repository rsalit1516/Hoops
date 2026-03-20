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
using Hoops.Application.Services;

namespace Hoops.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class TeamController : ControllerBase
    {
        private readonly ITeamRepository repository;
        private readonly ILogger<TeamController> _logger;
        private readonly ISeasonService _seasonService;
        private readonly IScheduleDivTeamsRepository _scheduleDivTeamsRepository;

        public TeamController(ITeamRepository repository, ILogger<TeamController> logger, ISeasonService seasonService, IScheduleDivTeamsRepository scheduleDivTeamsRepository)
        {
            this.repository = repository;
            _logger = logger;
            _seasonService = seasonService;
            _scheduleDivTeamsRepository = scheduleDivTeamsRepository;
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
        [Route("GetSeasonTeams/{seasonId:int}")]
        public ActionResult<IEnumerable<Team>> GetSeasonTeams(int seasonId)
        {
            if (seasonId <= 0)
            {
                return BadRequest("seasonId must be a positive integer.");
            }

            // Query teams directly via repository to ensure data is returned
            var teams = repository.GetSeasonTeams(seasonId) ?? new List<Team>();
            return Ok(teams);
        }

        /// <summary>
        /// Gets the mapped team number from ScheduleDivTeams based on schedule number and team number
        /// </summary>
        /// <param name="scheduleNumber">The schedule number</param>
        /// <param name="teamNumber">The team number from the Teams table</param>
        /// <returns>The corresponding team number from ScheduleDivTeams</returns>
        [HttpGet]
        [Route("GetMappedTeamNumber/{scheduleNumber:int}/{teamNumber:int}")]
        public ActionResult<int> GetMappedTeamNumber(int scheduleNumber, int teamNumber)
        {
            if (scheduleNumber <= 0 || teamNumber <= 0)
            {
                return BadRequest("scheduleNumber and teamNumber must be positive integers.");
            }

            var mappedTeamNumber = _scheduleDivTeamsRepository.GetTeamNo(scheduleNumber, teamNumber);
            return Ok(mappedTeamNumber);
        }

        /// <summary>
        /// Gets the mapped team number from ScheduleDivTeams based on schedule number, team number, and season
        /// </summary>
        /// <param name="scheduleNumber">The schedule number</param>
        /// <param name="teamNumber">The team number from the Teams table</param>
        /// <param name="seasonId">The season ID</param>
        /// <returns>The corresponding team number from ScheduleDivTeams</returns>
        [HttpGet]
        [Route("GetMappedTeamNumber/{scheduleNumber:int}/{teamNumber:int}/{seasonId:int}")]
        public ActionResult<int> GetMappedTeamNumber(int scheduleNumber, int teamNumber, int seasonId)
        {
            if (scheduleNumber <= 0 || teamNumber <= 0 || seasonId <= 0)
            {
                return BadRequest("scheduleNumber, teamNumber, and seasonId must be positive integers.");
            }

            var mappedTeamNumber = _scheduleDivTeamsRepository.GetTeamNo(scheduleNumber, teamNumber, seasonId);
            return Ok(mappedTeamNumber);
        }

        /// <summary>
        /// Reverse mapping: Gets the division-specific team number for display from the stored season-wide team number
        /// </summary>
        /// <param name="scheduleNumber">The schedule number</param>
        /// <param name="storedTeamNumber">The season-wide team number stored in ScheduleGames</param>
        /// <param name="seasonId">The season ID</param>
        /// <returns>The division-specific ScheduleTeamNumber for frontend display</returns>
        [HttpGet]
        [Route("GetDisplayTeamNumber/{scheduleNumber:int}/{storedTeamNumber:int}/{seasonId:int}")]
        public ActionResult<int> GetDisplayTeamNumber(int scheduleNumber, int storedTeamNumber, int seasonId)
        {
            if (scheduleNumber <= 0 || storedTeamNumber <= 0 || seasonId <= 0)
            {
                return BadRequest("scheduleNumber, storedTeamNumber, and seasonId must be positive integers.");
            }

            var displayTeamNumber = _scheduleDivTeamsRepository.GetScheduleTeamNumber(scheduleNumber, storedTeamNumber, seasonId);
            return Ok(displayTeamNumber);
        }

        /// <summary>
        /// Gets the valid schedule team numbers for a specific schedule and season
        /// </summary>
        /// <param name="scheduleNumber">The schedule number</param>
        /// <param name="seasonId">The season ID</param>
        /// <returns>List of valid ScheduleTeamNumbers with their display names</returns>
        [HttpGet]
        [Route("GetValidScheduleTeams/{scheduleNumber:int}/{seasonId:int}")]
        public async Task<ActionResult<IEnumerable<object>>> GetValidScheduleTeams(int scheduleNumber, int seasonId)
        {
            if (scheduleNumber <= 0 || seasonId <= 0)
            {
                return BadRequest("scheduleNumber and seasonId must be positive integers.");
            }

            var scheduleDivTeams = await _scheduleDivTeamsRepository
                .GetAllAsync();

            var validTeams = scheduleDivTeams
                .Where(sdt => sdt.ScheduleNumber == scheduleNumber && sdt.SeasonId == seasonId)
                .OrderBy(sdt => sdt.ScheduleTeamNumber)
                .Select(sdt => new
                {
                    scheduleTeamNumber = sdt.ScheduleTeamNumber,
                    teamNumber = sdt.TeamNumber,
                    displayName = $"Team {sdt.ScheduleTeamNumber}"
                })
                .ToList();

            return Ok(validTeams);
        }

    }
}
