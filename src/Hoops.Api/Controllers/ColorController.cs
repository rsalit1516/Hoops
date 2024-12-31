using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;
using Hoops.Core.Models;
using Hoops.Core.Interface;

namespace Hoops.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ColorController : ControllerBase
    {
        private readonly IColorRepository repository;
        private readonly ILogger<ColorController> _logger;
        public ColorController(IColorRepository repository, ILogger<ColorController> logger)
        {
            this.repository = repository;
            _logger = logger;
            _logger.LogDebug(1, "NLog injected into ColorController");
        }
        // GET: api/Colors
        [HttpGet]
        public ActionResult<IEnumerable<Color>> Get()
        {
            return Ok(repository.GetAll()
            .Where(c => c.Discontinued == false)
            .OrderBy(c => c.ColorName));
        }
    }
}
