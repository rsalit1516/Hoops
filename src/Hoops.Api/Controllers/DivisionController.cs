using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;

namespace csbc_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DivisionController : ControllerBase
    {
        // private readonly hoopsContext _context;
        private readonly IDivisionRepository repository;
        private readonly ISeasonService _seasonService;
        public DivisionController(IDivisionRepository repository, ISeasonService seasonService)
        {
            this.repository = repository;
            this._seasonService = seasonService;
        }

        // GET: api/Division
        [HttpGet]
        public async Task<IActionResult> GetDivision() => Ok(await repository.GetAllAsync());

        // GET: api/Division/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Division>> GetDivision(int id)
        {
            var division = await repository.FindByAsync(id);

            if (division == null)
            {
                return NotFound();
            }

            return division;
        }

        // PUT: api/Division/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDivision(int id, Division division)
        {
            if (id != division.DivisionId)
            {
                return BadRequest();
            }

            repository.Update(division);

            try
            {
                repository.SaveChanges();
            }
            catch (Exception)
            {

                if (await DivisionExists(id) == false)
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

        // POST: api/Division
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Division>> PostDivision(Division division)
        {
            await repository.InsertAsync(division);
            await repository.SaveChangesAsync();

            return CreatedAtAction("GetDivision", new { id = division.DivisionId }, division);
        }

        // DELETE: api/Division/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteDivision(int id)
        {
            try
            {
                // Verify existence first to return 404 when appropriate
                try
                {
                    var _ = await repository.FindByAsync(id);
                }
                catch
                {
                    return NotFound();
                }

                await repository.DeleteAsync(id);
                return Ok();
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException)
            {
                // Likely FK constraint (e.g., teams/games depend on division)
                return Conflict(new ProblemDetails
                {
                    Title = "Cannot delete division",
                    Detail = "The division has related records (e.g., teams or games). Remove dependencies first.",
                    Status = StatusCodes.Status409Conflict
                });
            }
            catch (System.Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new ProblemDetails
                {
                    Title = "Delete failed",
                    Detail = ex.Message,
                    Status = StatusCodes.Status500InternalServerError
                });
            }
        }

        private async Task<bool> DivisionExists(int id)
        {
            return await repository.FindByAsync(id) != null;
        }

        [Route("GetSeasonDivisions/{seasonId}")]
        [HttpGet]
        public async Task<IActionResult> GetSeasonDivisions(int seasonId)
        {
            // Use SeasonService to get divisions for a season (aggregate root pattern)
            var allSeasons = await _seasonService.GetAllSeasonsAsync();
            var season = allSeasons.FirstOrDefault(s => s.SeasonId == seasonId);
            if (season == null || season.Divisions == null)
            {
                return Ok(new List<Division>());
            }
            return Ok(season.Divisions);
        }
    }
}
