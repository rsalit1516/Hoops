using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Core.Models;

namespace Hoops.Core.Interface
{
    public interface ILocationRepository : IRepository<Location>
    {
       new Task<IEnumerable<Location>> GetAll();
    }
}
