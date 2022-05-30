using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hoops.Infrastructure.Interface;
using Hoops.Core.Models;
using Hoops.Core;
using Hoops.Core.ViewModels;
using Microsoft.Extensions.Logging;

namespace Hoops.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ColorController : ControllerBase
    {
        private readonly hoopsContext _context;
        private readonly IColorRepository repository;
        private readonly ILogger<ColorController> _logger;
        public ColorController(IColorRepository repository, ILogger<ColorController> logger)
        {
            this.repository = repository;
            _logger = logger;
            _logger.LogDebug(1, "NLog injected into ScheduleGameController");
        }
        // GET: api/Colors
        [HttpGet]
        public ActionResult<IEnumerable<Color>> Get()
        {
            return Ok(repository.GetAll());
        }
    }
}
