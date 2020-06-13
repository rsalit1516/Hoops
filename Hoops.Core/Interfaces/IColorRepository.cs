using System.Collections.Generic;
using System.Linq;
using Hoops.Core.Entities;
using Hoops.Infrastructure.Interface;

namespace Hoops.Infrastructure.Interface
{
    public interface IColorRepository : IRepository<Color>
    {
        Color GetByName(int companyId, string colorName);
        IEnumerable<Color> GetAll(int id);
    }
}
