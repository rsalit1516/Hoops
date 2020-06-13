using Hoops.Core.Entities;
using Hoops.Infrastructure.Interface;
using Microsoft.AspNetCore.Mvc;

namespace csbc_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DirectorController : Controller
    {
        private readonly IRepository<Director> repository;
        public DirectorController(IRepository<Director> repository) => this.repository = repository;

        /// <summary>
        /// Get - retrieve all directors
        /// </summary>
        [HttpGet]
        public IActionResult Get()
        {
            return View(repository.GetAll());
        }
    }
}