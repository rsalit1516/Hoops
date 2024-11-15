using System.Collections.Generic;
using System.Linq;
using Hoops.Core.Models;
using Hoops.Core.Interface;

namespace Hoops.Core.Interface
{
    public interface IColorRepository : IRepository<Color>
    {
        Color GetByName(int companyId, string colorName);
        IEnumerable<Color> GetAll(int id);
    }
}
