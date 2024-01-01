using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Core;
using Hoops.Core.Models;
using Hoops.Infrastructure.Interface;

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

        // GET: api/ScheduleGame
        [HttpGet]
        public ActionResult<IEnumerable<Location>> GetScheduleGame()
        {
            return Ok(repository.GetAll());
        }
    }
}