using Hoops.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hoops.Core.Interface
{
    public interface ICompanyRepository : IRepository<Company>
    {
        int FindCompanyByName(string name);
        bool FindByEmail(string email);
    }
}
