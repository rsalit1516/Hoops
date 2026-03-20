using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Hoops.Core.ViewModels;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hoops.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly hoopsContext _context;

        public AuthController(hoopsContext context)
        {
            _context = context;
        }

        public record LoginRequest(string userName, string password);

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<UserVm>> Login([FromBody] LoginRequest request)
        {
            var repo = new UserRepository(_context);
            var user = repo.GetUser(request.userName, request.password);
            if (user == null)
            {
                return Unauthorized();
            }
            var roles = _context.Roles
                .Where(s => s.UserId == user.UserId)
                .Select(s => s.ScreenName);
            var divisions = _context.Divisions.Where(d => d.DirectorId == user.PersonId);
            var userVm = UserVm.ConvertToVm(user, roles, divisions);

            // Build claims identity
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.UserName ?? string.Empty),
                new Claim("userType", (user.UserType ?? 0).ToString())
            };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);
            return Ok(userVm);
        }

        [HttpGet("me")]
        public ActionResult<UserVm> Me()
        {
            if (!User.Identity?.IsAuthenticated ?? true)
            {
                return Unauthorized();
            }

            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out var userId))
            {
                return Unauthorized();
            }
            var user = _context.Users.FirstOrDefault(u => u.UserId == userId);
            if (user == null) return Unauthorized();
            var roles = _context.Roles
                .Where(s => s.UserId == user.UserId)
                .Select(s => s.ScreenName);
            var divisions = _context.Divisions.Where(d => d.DirectorId == user.PersonId);
            var userVm = UserVm.ConvertToVm(user, roles, divisions);
            return Ok(userVm);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return NoContent();
        }
    }
}
