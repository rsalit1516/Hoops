using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace csbc_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly hoopsContext _context;

        public UserController(hoopsContext context)
        {
            _context = context;
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

            var repo = new UserRepository(_context);

            try
            {
                if (!await repo.UserExistsAsync(id))
                {
                    return NotFound();
                }

                await repo.UpdateUserAsync(user);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error updating user: {ex.Message}");
            }
        }

        // POST: api/User
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            var repo = new UserRepository(_context);

            try
            {
                var createdUser = await repo.InsertUserAsync(user);
                return CreatedAtAction("GetUser", new { id = createdUser.UserId }, createdUser);
            }
            catch (Exception ex)
            {
                // Log the specific error for debugging
                // You might want to add proper logging here
                return BadRequest($"Error creating user: {ex.Message}");
            }
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
        [Route("login/{userName}/{password}")]
        [HttpGet]
        public ActionResult<UserVm> Get(string userName, string password)
        {
            var repo = new UserRepository(_context);
            var userVm = new UserVm();
            //get user - what if user is invalid?
            var user = repo.GetUser(userName, password);
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
