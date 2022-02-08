using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Core;
using Hoops.Infrastructure.Interface;
using Microsoft.AspNetCore.Mvc;

namespace Hoops.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationController : ControllerBase
    {
                private readonly hoopsContext _context;
        private readonly IScheduleLocationRepository repository;

    }
}