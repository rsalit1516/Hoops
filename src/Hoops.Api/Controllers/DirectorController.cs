using Hoops.Core.Interface;
using Hoops.Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace Hoops.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DirectorController : Controller
    {
        private readonly IDirectorRepository repository;
        public DirectorController(IDirectorRepository repository) => this.repository = repository;

        /// <summary>
        /// Get - retrieve all directors
        /// </summary>
        [HttpGet]
        public IActionResult Get() => Ok(repository.GetAll(1));

        /// <summary>
        /// GET: api/Director/volunteers
        /// Get all people who are eligible to be directors (BoardOfficer or BoardMember = true)
        /// </summary>
        [HttpGet("volunteers")]
        public IActionResult GetDirectorVolunteers()
        {
            var volunteers = repository.GetDirectorVolunteers(1);
            return Ok(volunteers);
        }

        /// <summary>
        /// GET: api/Director/5
        /// Get a specific director by ID
        /// </summary>
        [HttpGet("{id}")]
        public ActionResult<Director> GetDirector(int id)
        {
            var director = repository.GetById(id);

            if (director == null)
            {
                return NotFound();
            }

            return Ok(director);
        }

        /// <summary>
        /// POST: api/Director
        /// Create a new director
        /// </summary>
        [HttpPost]
        public ActionResult<Director> PostDirector(Director director)
        {
            var created = repository.Insert(director);
            repository.SaveChanges();
            return Ok(created);
        }

        /// <summary>
        /// PUT: api/Director/5
        /// Update an existing director
        /// </summary>
        [HttpPut("{id}")]
        public ActionResult<Director> PutDirector(int id, Director director)
        {
            if (id != director.DirectorId)
            {
                return BadRequest();
            }

            var updated = repository.Update(director);
            repository.SaveChanges();

            return Ok(updated);
        }

        /// <summary>
        /// DELETE: api/Director/5
        /// Delete a director
        /// </summary>
        [HttpDelete("{id}")]
        public ActionResult<Director> DeleteDirector(int id)
        {
            var director = repository.GetById(id);
            if (director == null)
            {
                return NotFound();
            }

            repository.Delete(director);
            repository.SaveChanges();

            return Ok(director);
        }
    }
}