using Microsoft.AspNetCore.Mvc;
using Hoops.Data.Seeders;
using Hoops.Data;
using System;
using System.Threading.Tasks;

namespace Hoops.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DebugController : ControllerBase
    {
        private readonly SeedCoordinator _seedCoordinator;

        public DebugController(SeedCoordinator seedCoordinator)
        {
            _seedCoordinator = seedCoordinator;
        }

        [HttpPost("reseed")]
        public async Task<IActionResult> ReseedData()
        {
            try
            {
                Console.WriteLine("[DEBUG] Manual reseed triggered...");
                await _seedCoordinator.InitializeDataAsync();
                Console.WriteLine("[DEBUG] Manual reseed completed.");
                return Ok("Data reseeded successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[DEBUG] Reseed failed: {ex.Message}");
                return BadRequest($"Reseed failed: {ex.Message}");
            }
        }
    }
}
