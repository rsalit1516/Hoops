using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Hoops.Infrastructure.Data;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Hoops.Core.Interface;

namespace csbc_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly hoopsContext _context;
        private readonly IUserRepository repository;
        private readonly ILogger<UserController> _logger;

        public UserController(hoopsContext context, IUserRepository repository, ILogger<UserController> logger)
        {
            _context = context;
            this.repository = repository;
            _logger = logger;
            _logger.LogDebug(1, "NLog injected into UserController");
        }

        // GET: api/User
        [HttpGet]
        public ActionResult<IEnumerable<User>> GetUsers()
        {   
            return _context.Users.ToList();
        }

        // GET: api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/User/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.UserId)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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

        // POST: api/User
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            _context.Users.Add(user);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UserExists(user.UserId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetUser", new { id = user.UserId }, user);
        }

        // DELETE: api/User/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<User>> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return user;
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.UserId == id);
        }

        /// <summary>
        /// Get
        /// </summary>
        /// <remarks>
        /// Retrieves user info including screen rights and division rights
        /// </remarks>
        /// <param name="userName"></param>
        /// <param name="password"></param>
        /// <returns></returns>
/// 
        [Route("login/{userName}/{password}")]
        [HttpGet]
        public ActionResult<UserVm> Get(string userName, string password)
        {
            // var repo = new UserRepository(_context, logger);
            var userVm = new UserVm();
            //get user - what if user is invalid?
            var user = repository.GetUser(userName, password);
            if (user != null)
            {
                var context = new hoopsContext();
                var roles = _context.Roles
                    .Where(s => s.UserId == user.UserId)
                    .Select(s => s.ScreenName);
                var divisions = _context.Divisions.Where(d => d.DirectorId == user.PersonId);
                userVm = UserVm.ConvertToVm(user, roles, divisions);
            }
            else
            {
                // Return an error message if the user is not found
                return BadRequest("Invalid username or password.");
            }

            return userVm;
        }

    }
}
