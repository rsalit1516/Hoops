using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Hoops.Infrastructure.Data;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;
using Hoops.Core.Interface;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;

namespace Hoops.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonController : ControllerBase
    {
        private readonly hoopsContext _context;
        private readonly IPersonRepository repository;
        private readonly ILogger<PersonController> _logger;
        private readonly int companyId = 1;

        public PersonController(IPersonRepository repository, ILogger<PersonController> logger)
        {
            _context = new hoopsContext();
            this.repository = repository;
            _logger = logger;
            _logger.LogDebug(1, "NLog injected into ScheduleGameController");
        }

        // GET: api/User
        [HttpGet]
        public ActionResult<IEnumerable<Person>> GetPeople()
        {
            _logger.LogInformation("Retrieving ADs");
            var people = repository.GetAll();
            return Ok(people);
        }
        [HttpGet]
        [Route("GetADs")]
        public ActionResult<IEnumerable<Person>> GetADPeople()
        {
            _logger.LogInformation("Retrieving ADs");
            var people = repository.GetADs(companyId);
            return Ok(people);
        }
        // GET: api/User
        [HttpGet("GetHouseholdMembers/{id}")]
        public ActionResult<IEnumerable<PersonVM>> GetHouseholdMembers(int id)
        {
            _logger.LogInformation("Retrieving household members");
            var people = repository.GetByHousehold(id);
            return Ok(people);
        }
        // GET: api/person/search
        [HttpGet("search")]
        public ActionResult<IEnumerable<PersonVM>> Search(
            [FromQuery] string lastName,
            [FromQuery] string firstName,
            [FromQuery] bool playerOnly)
        {
            _logger.LogInformation("Searching for people");
            var people = repository.FindPeopleByLastAndFirstName(lastName, firstName, playerOnly);
            return Ok(people);

        }
    }
}
