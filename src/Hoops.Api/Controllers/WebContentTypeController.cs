using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hoops.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WebContentTypeController : ControllerBase
    {
        private readonly hoopsContext _context;

        public WebContentTypeController(hoopsContext context)
        {
            _context = context;
        }

        // GET: api/WebContentType
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WebContentType>>> GetWebContentType()
        {
            return await _context.WebContentTypes.ToListAsync();
        }

        // GET: api/WebContentType/5
        [HttpGet("{id}")]
        public async Task<ActionResult<WebContentType>> GetWebContentType(int id)
        {
            var webContentType = await _context.WebContentTypes.FindAsync(id);

            if (webContentType == null)
            {
                return NotFound();
            }

            return webContentType;
        }

        // PUT: api/WebContentType/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWebContentType(int id, WebContentType webContentType)
        {
            if (id != webContentType.WebContentTypeId)
            {
                return BadRequest();
            }

            _context.Entry(webContentType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WebContentTypeExists(id))
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

        // POST: api/WebContentType
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<WebContentType>> PostWebContentType(WebContentType webContentType)
        {
            _context.WebContentTypes.Add(webContentType);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetWebContentType", new { id = webContentType.WebContentTypeId }, webContentType);
        }

        // DELETE: api/WebContentType/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<WebContentType>> DeleteWebContentType(int id)
        {
            var webContentType = await _context.WebContentTypes.FindAsync(id);
            if (webContentType == null)
            {
                return NotFound();
            }

            _context.WebContentTypes.Remove(webContentType);
            await _context.SaveChangesAsync();

            return webContentType;
        }

        private bool WebContentTypeExists(int id)
        {
            return _context.WebContentTypes.Any(e => e.WebContentTypeId == id);
        }
    }
}
