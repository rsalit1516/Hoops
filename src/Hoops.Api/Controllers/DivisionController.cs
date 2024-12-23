using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using System;

namespace csbc_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DivisionController : ControllerBase
    {
        // private readonly hoopsContext _context;
        private readonly IDivisionRepository repository;
        public DivisionController(IDivisionRepository repository) => this.repository = repository;

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
                await repository.DeleteAsync(id);
                return Ok();
            }
             catch
            {
                return NotFound();
            }
        }

        private async Task<bool> DivisionExists(int id)
        {
            return await repository.FindByAsync(id) != null;
        }

        [Route("GetSeasonDivisions/{seasonId}")]
        [HttpGet]
        public async Task<IActionResult> GetSeasonDivisions(int seasonId) => 
        Ok(await repository.GetSeasonDivisionsAsync(seasonId));
    }
}
