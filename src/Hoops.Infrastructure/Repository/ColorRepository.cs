﻿using Hoops.Core.Models;
using Hoops.Core.Interface;
using Hoops.Infrastructure.Data;

namespace Hoops.Infrastructure.Repository
{
    public class ColorRepository : EFRepository<Color>, IColorRepository
    {
        public ColorRepository(hoopsContext context) : base(context) { }

        public Color? GetByName(int companyId, string colorName)
        {
            var color = context.Set<Color>().FirstOrDefault(c => c.ColorName == colorName && c.CompanyId == companyId);
            if (color == null)
            {
                // Optionally log a message or handle the case where the color is not found
                Console.WriteLine($"Color with name '{colorName}' and company ID '{companyId}' not found.");
            }
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
