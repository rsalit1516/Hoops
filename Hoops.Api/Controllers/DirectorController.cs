using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Infrastructure.Interface;
using Microsoft.AspNetCore.Mvc;
using System;

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
        public async Task<IActionResult> Get() => Ok(await repository.GetAllAsync());
    }
}