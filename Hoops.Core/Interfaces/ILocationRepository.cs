using System.Collections.Generic;
using Hoops.Core.Models;

namespace Hoops.Infrastructure.Interface
{
    public interface ILocationRepository : IRepository<Location>
    {
        List<VwDirector> GetAll(int companyId);
        List<VwDirector> GetDirectorVolunteers(int companyId);
    }
}
