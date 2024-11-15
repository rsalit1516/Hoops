using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Core.Interface;
using Microsoft.AspNetCore.Mvc;

namespace Hoops.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SponsorController : ControllerBase
    {
         private readonly ISponsorRepository repository;
        public ISponsorRepository Sponsors { get; set; }
        public SponsorController(ISponsorRepository repository)
        {
            this.repository = repository;
        }

        /// <summary>
        /// GET: api/Season
        /// </summary>
        [Route("GetSeasonSponsors/{seasonId}")]
        [HttpGet]
        public async Task<IActionResult> GetSeasonSponsors(int seasonId)
        {
            return Ok(await repository.GetSeasonSponsorsAsync(seasonId));
        }
    }
}
