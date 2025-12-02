using Hoops.Core.Models;
using Hoops.Core.Interface;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Hoops.Application.Services;
using System.Linq;
using System;

namespace Hoops.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeasonController : ControllerBase
    {
        private readonly ISeasonRepository repository;
        public ISeasonRepository Seasons { get; set; }
        private readonly ISeasonService _seasonService;
        public SeasonController(ISeasonRepository repository, ISeasonService seasonService)
        {
            this.repository = repository;
            this._seasonService = seasonService;
        }

        /// <summary>
        /// GET: api/Season
        /// </summary>
        [Route("GetAll")]
        [HttpGet]
        public async Task<IActionResult> GetSeason()
        {
            var seasons = await _seasonService.GetAllSeasonsAsync();
            if (seasons == null || !seasons.Any())
            {
                return NotFound();
            }
            return Ok(seasons);
        }

        /// <summary>
        /// GetCurrentSeason - retrieves the current season
        /// </summary>
        /// <param name="id">uses the companyId</param>
        /// <returns></returns>
        [Route("GetCurrentSeason")]
        [HttpGet]
        public async Task<IActionResult> GetCurrentSeason(int id)
        {
            try
            {
                var season = await _seasonService.GetCurrentSeasonAsync(1);
                return Ok(season);
            }
            catch (InvalidOperationException)
            {
                return NotFound();
            }
        }

        /// <summary>
        /// GetSeason
        /// </summary>
        /// <param name="id">get the called season using the SeasonId</param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public ActionResult<Season> GetSeason(int id)
        {
            var season = repository.GetById(id);

            if (season == null)
            {
                return NotFound();
            }

            return Ok(season);
        }

        // PUT: api/Season/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public ActionResult<Season> PutSeason(int id, Season season)
        {
            if (id != season.SeasonId)
            {
                return BadRequest();
            }
            var newSeason = repository.Update(season);
            repository.SaveChanges();

            return Ok(newSeason);
        }

        // POST: api/Season
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public ActionResult<Season> PostSeason(Season season)
        {
            var created = repository.Insert(season);
            repository.SaveChanges();
            return Ok(created);
        }

        // DELETE: api/Season/5
        [HttpDelete("{id}")]
        public ActionResult<Season> DeleteSeason(int id)
        {
            var season = repository.GetById(id);
            if (season == null)
            {
                return NotFound();
            }

            repository.Delete(season);
            repository.SaveChanges();

            return Ok(season);
        }

        private bool SeasonExists(int id)
        {
            return repository.GetById(id) != null;
        }

        // GET api/<controller>/5

        // public async Task<ActionResult<Season>> Get(int id)
        // {
        //     var season = await _context.Season.FirstOrDefaultAsync(s => s.CompanyId == 1 && s.SeasonId == id);
        //     if (season == null)
        //     {
        //         return NotFound();
        //     }

        //     return season;
        // }
    }
}
