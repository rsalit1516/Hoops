using System.Collections.Generic;
using Hoops.Core.Models;

namespace Hoops.Infrastructure.Interface
{
    public interface ILocationRepository : IRepository<Location>
    {
        new IEnumerable<Location> GetAll();
    }
}
