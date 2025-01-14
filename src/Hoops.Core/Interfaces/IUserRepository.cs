
using System.Linq;
using Hoops.Core.Models;

namespace Hoops.Core.Interface
{
    public interface IUserRepository : IRepository<User>
    {
        User GetUser(string userName, string password);
    }
}