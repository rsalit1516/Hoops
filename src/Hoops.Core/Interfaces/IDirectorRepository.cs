using System.Collections.Generic;
using Hoops.Core.Models;

namespace Hoops.Core.Interface
{
    public interface IDirectorRepository : IRepository<Director>
    {
        List<VwDirector> GetAll(int companyId);
        List<VwDirector> GetDirectorVolunteers(int companyId);
    }
}
