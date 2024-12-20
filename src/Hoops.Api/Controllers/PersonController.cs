using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;
using Hoops.Core.Interface;
using Microsoft.Extensions.Logging;

namespace csbc_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonController : ControllerBase
    {
        private readonly hoopsContext _context;
        private readonly IPersonRepository repository;
        private readonly ILogger<PersonController> _logger;
        private int companyId = 1;

        public PersonController(IPersonRepository repository, ILogger<PersonController> logger)
        {
            _context = new hoopsContext();
            this.repository = repository;
            _logger = logger;
            _logger.LogDebug(1, "NLog injected into ScheduleGameController");
        }

        // GET: api/User
        [HttpGet]
        public ActionResult<IEnumerable<Person>> GetADPeople()
        {   
             _logger.LogInformation("Retrieving season games");
            var games = repository.GetADs(companyId);
            return Ok(games);
        }        
    }
}
