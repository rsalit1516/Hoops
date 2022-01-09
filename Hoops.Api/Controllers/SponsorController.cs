using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hoops.Infrastructure.Interface;
using Hoops.Core.Models;
using Hoops.Core;
using Hoops.Core.ViewModels;
using Microsoft.Extensions.Logging;
namespace Hoops.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SponsorController : ControllerBase
    {
        private readonly hoopsContext _context;
        private readonly ISponsorRepository repository;
        private readonly ILogger<SponsorController> _logger;
        public SponsorController(ISponsorRepository repository, ILogger<SponsorController> logger)
        {
            this.repository = repository;
            _logger = logger;
            // _context = new hoopsContext();
            _logger.LogDebug(1, "NLog injected into ScheduleGameController");
        }

        /// <summary>
        /// GetSeasonSponsors
        /// </summary>
        /// <returns>Lists<Sponsors></returns>
        [HttpGet()]
        public async Task<ActionResult<List<Sponsor>>> GetSeasonSponsors()
        {
            // var season = await _context.Seasons.FirstOrDefaultAsync(season => season.CurrentSeason == true);
            return Ok(await repository.GetSeasonSponsors());
        }
    }
}