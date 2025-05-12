using Hoops.Core.Models;

namespace Hoops.Core.Interface
{
    public interface ICompanyRepository : IRepository<Company>
    {
        int FindCompanyByName(string name);
        bool FindByEmail(string email);
    }
}
