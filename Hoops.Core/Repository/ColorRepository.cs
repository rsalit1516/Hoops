using System.Collections.Generic;
using System.Linq;
using Hoops.Core.Entities;
using Csbc.Infrastructure;
using Hoops.Infrastructure.Interface;


namespace Hoops.Infrastructure.Repository
{
    public class ColorRepository : EFRepository<Color>, IColorRepository
    {
        public ColorRepository(hoopsContext context) : base(context) {}
 
        public Color GetByName(int companyId, string colorName)
        {
            var color = context.Set<Color>().FirstOrDefault(c => c.ColorName == colorName && c.CompanyId == companyId);
            return color;
        }

        public IEnumerable<Color> GetAll(int companyId)
        {
            return context.Colors
            .Where(c => c.CompanyId == companyId).OrderBy(c => c.ColorName);
        }
        public override Color Insert(Color entity)
        {
            if (entity.ColorId == 0)
                entity.ColorId = context.Set<Color>().Any() ? context.Set<Color>().Max(c => c.ColorId) + 1 : 1;
            return base.Insert(entity);
        }
    }
}
