using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Core.Interface;
using Hoops.Infrastructure.Repository;
using Hoops.Infrastructure.Data;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Hoops.Data.Seeders
{
    public class DivisionSeeder : ISeeder<Division>
    {
        public hoopsContext context { get; private set; }
        private readonly IDivisionRepository _divisionRepo;

        public DivisionSeeder(IDivisionRepository divisionRepo, hoopsContext context)
        {
            this.context = context;
            _divisionRepo = divisionRepo;
        }

        public async Task DeleteAllAsync()
        {
            var records = await _divisionRepo.GetAllAsync();
            Console.WriteLine($"[DEBUG] Found {records.Count()} divisions to delete");
            foreach (var record in records)
            {
                Console.WriteLine($"[DEBUG] Attempting to delete Person ID: {record.DivisionId}, Name: {record.DivisionDescription}");
                await _divisionRepo.DeleteAsync(record.DivisionId);
            }
        }
        public async Task SeedAsync()
        {
            int maxDivisionId = context.Divisions.Any() ? context.Divisions.Max(c => c.DivisionId) : 0;
            var seasons = await context.Seasons.ToListAsync();
            Console.WriteLine($"[DEBUG] Found {seasons.Count()} seasons to initialize divisions for.");
            if (seasons.Count() == 0)
            {
                Console.WriteLine("[DEBUG] No seasons found, skipping division initialization.");
                return;
            }
            Console.WriteLine($"[DEBUG] divisionRepo is null: {_divisionRepo == null}");

            Console.WriteLine($"[DEBUG] seasons is null: {seasons == null}");
            foreach (var season in seasons)
            {
                Console.WriteLine($"[DEBUG] Initializing divisions for season: {season.SeasonId}");
                var seasonYear = season.FromDate.HasValue ? season.FromDate.Value.Year : 2024;
                var divisions = new List<Division>
                {
new()
                    {
                        CompanyId = 1,
                        SeasonId = season.SeasonId,
                        DivisionDescription = "T2 - Coed",
                        Gender = "M",
                        Gender2 = "F",
                        MinDate = new DateTime(seasonYear, 08, 31).AddYears(-8),
                        MaxDate = new DateTime(seasonYear, 09, 1).AddYears(-7),
                        MinDate2 = new DateTime(seasonYear, 08, 31).AddYears(-8),
                        MaxDate2 = new DateTime(seasonYear, 09, 1).AddYears(-7),
    Stats = true,
                        DraftVenue = "Mullins Hall",
                        DraftTime = "7:00 PM",
                        CreatedDate = DateTime.Now,
                        CreatedUser = "Seed"

                    },
                    new Division
                    {
                        CompanyId = 1,
                        SeasonId = season.SeasonId,
                        DivisionDescription = "T4 - Coed",
                        Gender = "M",
                        Gender2 = "F",
                        MinDate = new DateTime(seasonYear, 08, 31).AddYears(-10),
                        MaxDate = new DateTime(seasonYear, 09, 1).AddYears(-9),
                        MinDate2 = new DateTime(seasonYear, 08, 31).AddYears(-10),
                        MaxDate2 = new DateTime(seasonYear, 09, 1).AddYears(-9),
    Stats = true,
                        DraftVenue = "Mullins Hall",
                        DraftTime = "7:00 PM",
                        CreatedDate = DateTime.Now,
                        CreatedUser = "Seed"

                    },
                    new() {
                        CompanyId = 1,
                        SeasonId = season.SeasonId,
                        DivisionDescription = "JV Girls",
                        Gender = "F",
                        MinDate = new DateTime(seasonYear, 08, 31).AddYears(-16),
                        MaxDate = new DateTime(seasonYear, 09, 1).AddYears(-14),
                        Stats = true,
                        DraftVenue = "Mullins Hall",
                        DraftTime = "7:00 PM",
                        CreatedDate = DateTime.Now,
                        CreatedUser = "Seed"
                    },

                    new Division
                    {
                        CompanyId = 1,
                        SeasonId = season.SeasonId,
                        DivisionDescription = "JV Boys",
                        Gender = "M",
                        MinDate = new DateTime(seasonYear, 08, 31).AddYears(-16),
                        MaxDate = new DateTime(seasonYear, 09, 1).AddYears(-14),
                        Gender2 = "F",
                        Stats = true,
                        DraftVenue = "Mullins Hall",
                        DraftTime = "7:00 PM",
                        CreatedDate = DateTime.Now,
                        CreatedUser = "Seed"
                    },
                    new Division
                    {
                        CompanyId = 1,
                        SeasonId = season.SeasonId,
                        DivisionDescription = "HS Boys",
                        Gender = "M",
                        Gender2 = "F",
                        MinDate = new DateTime(seasonYear, 08, 31).AddYears(-18),
                        MaxDate = new DateTime(seasonYear, 09, 1).AddYears(-16),
                        Stats = true,
                        DraftVenue = "Mullins Hall",
                        DraftTime = "7:00 PM",
                        CreatedDate = DateTime.Now,
                        CreatedUser = "Seed"

                    },

                };

                foreach (var division in divisions)
                {
                    await _divisionRepo.InsertAsync(division);
                }
                context.SaveChanges();
            }
        }
    }
}
