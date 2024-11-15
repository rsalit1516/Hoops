using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Core.Models;

namespace Hoops.Infrastructure.Interface{
    public interface IHouseholdRepository : IRepository<Household>
    {
        IQueryable<Household> GetRecords(int CompanyId = 1, string name = "", string address = "", string phone = "", string email = "");    
        IQueryable<Household> GetByName(string name);
        IQueryable<Household> GetAll(int companyId);
    }
}
