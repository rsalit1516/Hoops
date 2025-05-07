using System.Collections.Generic;
using Hoops.Core.Models;

namespace Hoops.Core.Interface
{
    public interface IColorRepository : IRepository<Color>
    {
        Color GetByName(int companyId, string colorName);
        IEnumerable<Color> GetAll(int id);
    }
}
