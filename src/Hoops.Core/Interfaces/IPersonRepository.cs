using System.Collections.Generic;
using System.Linq;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;
using Hoops.Core.Enum;
using System.Threading.Tasks;

namespace Hoops.Core.Interface
{
    public interface IPersonRepository : IRepository<Person>
    {
        int FindPersonByLastName(string name);
        Person FindPersonByLastAndFirstName(string lastName, string firstName);
        IQueryable<PersonVM> FindPeopleByLastAndFirstName(string lastName, string firstName, bool playerOnly);
        int FindByEmail(string email);
        IQueryable<Person> GetByGroup(int companyId, int seasonId, GroupTypes.GroupType group);
        int GetBccList(string lastName, string firstName);
        IQueryable<Person> GetADs(int companyId);
        void RemoveFromHousehold(int p);
        List<string> GetParents(int personId); 
        List<Person> GetByHousehold(int householdId);
    }
}
