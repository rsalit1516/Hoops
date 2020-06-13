using Hoops.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hoops.Infrastructure.Interface
{
    public interface ICompanyRepository : IRepository<Company>
    {
        int FindCompanyByName(string name);
        bool FindByEmail(string email);
    }
}
