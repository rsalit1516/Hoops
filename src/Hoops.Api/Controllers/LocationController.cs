using System.Threading.Tasks;
using Hoops.Core.Interface;
using Hoops.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Hoops.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationController : ControllerBase
    {
        private readonly hoopsContext _context;
        private readonly ILocationRepository repository;
        private readonly ILogger<LocationController> _logger;

        public LocationController(ILocationRepository repository, ILogger<LocationController> logger)
        {
            _context = new hoopsContext();
            this.repository = repository;
            _logger = logger;
            _logger.LogDebug(1, "NLog injected into ScheduleGameController");
        }

        // GET: api/Locations
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await repository.GetAll());
        }
    }
}