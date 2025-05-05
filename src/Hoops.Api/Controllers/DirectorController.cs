using Hoops.Core.Interface;
using Microsoft.AspNetCore.Mvc;

namespace Hoops.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DirectorController : Controller
    {
        private readonly IDirectorRepository repository;
        public DirectorController(IDirectorRepository repository) => this.repository = repository;

        /// <summary>
        /// Get - retrieve all directors
        /// </summary>
        [HttpGet]
        public IActionResult Get() => Ok(repository.GetAll(1));
    }
}