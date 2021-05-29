using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hoops.Core.Models;

namespace Hoops.Infrastructure.Interface
{
    public interface IDirectorRepository : IRepository<Director>
    {
        IQueryable<VwDirector> GetAll(int companyId);
        List<VwDirector> GetDirectorVolunteers(int companyId);
    }
}
