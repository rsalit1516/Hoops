using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Core.Interface;
using Hoops.Infrastructure.Data;
using System.Linq;

namespace Hoops.Data.Seeders
{
    public class ColorSeeder : ISeeder<Color>
    {
        public hoopsContext context { get; private set; }
        private readonly IColorRepository _colorRepo;

        public ColorSeeder(IColorRepository colorRepo, hoopsContext context)
        {
            this.context = context;
            _colorRepo = colorRepo;
        }

        public async Task DeleteAllAsync()
        {
            var records = await _colorRepo.GetAllAsync();
            Console.WriteLine($"[DEBUG] Found {records.Count()} colors to delete");
            foreach (var record in records)
            {
                Console.WriteLine($"[DEBUG] Attempting to delete Person ID: {record.ColorId}, Name: {record.ColorName}");
                await _colorRepo.DeleteAsync(record.ColorId);
            }
        }
        public async Task SeedAsync()
        {
            int maxColorId = context.Colors.Any() ? context.Colors.Max(c => c.ColorId) : 0;
            // maxColorId++;
            var colors = new List<Color>
            {
                new Color
                {
                    CompanyId = 1,
                    ColorId = ++maxColorId,
                    ColorName = "Red",
                    Discontinued = false,
                    CreatedDate = DateTime.Now,
                    CreatedUser = "Seed",
                },
                new Color
                {
                    CompanyId = 1,
                    ColorId = ++maxColorId,
                    ColorName = "Blue",
                    Discontinued = false,
                    CreatedDate = DateTime.Now,
                    CreatedUser = "Seed",
                },
                new Color
                {
                    CompanyId = 1,
                    ColorId = ++maxColorId,
                    ColorName = "Black",
                    Discontinued = false,
                    CreatedDate = DateTime.Now,
                    CreatedUser = "Seed",

                },
                new Color
                {
                    CompanyId = 1,
                    ColorId = ++maxColorId,
                    ColorName = "Yellow",
                    Discontinued = false,
                    CreatedDate = DateTime.Now,
                    CreatedUser = "Seed",

                },
            new Color
            {
                CompanyId = 1,
                ColorId = ++maxColorId,
                ColorName = "Orange",
                Discontinued = false,
                CreatedDate = DateTime.Now,
                CreatedUser = "Seed",

            },
                        new Color
            {
                CompanyId = 1,
                ColorId = ++maxColorId,
                ColorName = "Gray",
                Discontinued = false,
                CreatedDate = DateTime.Now,
                CreatedUser = "Seed",
            }

            };
            foreach (var content in colors)
            {
                await _colorRepo.InsertAsync(content);
            }
            context.SaveChanges();
        }
    }
}
