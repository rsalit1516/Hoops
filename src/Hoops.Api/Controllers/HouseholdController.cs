using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Hoops.Core.Models;
using Hoops.Core;
using Microsoft.EntityFrameworkCore;

namespace Hoops.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HouseholdController : ControllerBase
    {
        private readonly hoopsContext _context;

        public HouseholdController(hoopsContext context)
        {
            _context = context;
        }

        // GET: api/Household
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Household>>> GetHousehold()
        {
            return await _context.Households.ToListAsync();
        }

        // GET: api/Household/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Household>> GetHousehold(int id)
        {
            var household = await _context.Households.FindAsync(id);

            if (household == null)
            {
                return NotFound();
            }

            return household;
        }

        // PUT: api/Household/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHousehold(int id, Household household)
        {
            if (id != household.HouseId)
            {
                return BadRequest();
            }

            _context.Entry(household).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HouseholdExists(id))
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

        // POST: api/Household
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Household>> PostHousehold(Household household)
        {
            _context.Households.Add(household);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (HouseholdExists(household.HouseId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetHousehold", new { id = household.HouseId }, household);
        }

        // DELETE: api/Household/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Household>> DeleteHousehold(int id)
        {
            var household = await _context.Households.FindAsync(id);
            if (household == null)
            {
                return NotFound();
            }

            _context.Households.Remove(household);
            await _context.SaveChangesAsync();

            return household;
        }

        private bool HouseholdExists(int id)
        {
            return _context.Households.Any(e => e.HouseId == id);
        }
    }
}
