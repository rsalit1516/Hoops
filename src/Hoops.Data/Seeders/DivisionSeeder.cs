using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Core.Interface;
using Hoops.Infrastructure.Repository;
using Hoops.Infrastructure.Data;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Hoops.Data.Seeders
{
    public class DivisionSeeder : ISeeder<Division>
    {
        public hoopsContext context { get; private set; }
        private readonly IDivisionRepository _divisionRepo;
        private readonly ILogger<DivisionSeeder> _logger;

        public DivisionSeeder(IDivisionRepository divisionRepo, hoopsContext context, ILogger<DivisionSeeder> logger)
        {
            this.context = context;
            _divisionRepo = divisionRepo;
            _logger = logger;
        }

        public async Task DeleteAllAsync()
        {
            var records = await _divisionRepo.GetAllAsync();
            _logger.LogDebug("Found {Count} divisions to delete", records.Count());
            foreach (var record in records)
            {
                _logger.LogDebug("Attempting to delete Division ID: {DivisionId}, Name: {DivisionDescription}", record.DivisionId, record.DivisionDescription);
                await _divisionRepo.DeleteAsync(record.DivisionId);
            }
        }
        public async Task SeedAsync()
        {
            int maxDivisionId = context.Divisions.Any() ? context.Divisions.Max(c => c.DivisionId) : 0;
            var seasons = await context.Seasons.ToListAsync();
            _logger.LogDebug("Found {Count} seasons to initialize divisions for", seasons.Count());
            if (seasons.Count() == 0)
            {
                _logger.LogDebug("No seasons found, skipping division initialization");
                return;
            }
            _logger.LogDebug("divisionRepo is null: {IsNull}", _divisionRepo == null);

            _logger.LogDebug("seasons is null: {IsNull}", seasons == null);
            foreach (var season in seasons)
            {
                _logger.LogDebug("Initializing divisions for season: {SeasonId}", season.SeasonId);
                var seasonYear = season.FromDate.HasValue ? season.FromDate.Value.Year : 2024;
                var divisions = new List<Division>
                {
new()
                    {
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
                        CreatedDate = DateTime.UtcNow,

                    },
                    new Division
                    {
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
                        CreatedDate = DateTime.UtcNow,

                    },
                    new() {
                        SeasonId = season.SeasonId,
                        DivisionDescription = "JV Girls",
                        Gender = "F",
                        MinDate = new DateTime(seasonYear, 08, 31).AddYears(-16),
                        MaxDate = new DateTime(seasonYear, 09, 1).AddYears(-14),
                        Stats = true,
                        DraftVenue = "Mullins Hall",
                        DraftTime = "7:00 PM",
                        CreatedDate = DateTime.UtcNow,
                    },

                    new Division
                    {
                        SeasonId = season.SeasonId,
                        DivisionDescription = "JV Boys",
                        Gender = "M",
                        MinDate = new DateTime(seasonYear, 08, 31).AddYears(-16),
                        MaxDate = new DateTime(seasonYear, 09, 1).AddYears(-14),
                        Gender2 = "F",
                        Stats = true,
                        DraftVenue = "Mullins Hall",
                        DraftTime = "7:00 PM",
                        CreatedDate = DateTime.UtcNow,
                    },
                    new Division
                    {
                        SeasonId = season.SeasonId,
                        DivisionDescription = "HS Boys",
                        Gender = "M",
                        Gender2 = "F",
                        MinDate = new DateTime(seasonYear, 08, 31).AddYears(-18),
                        MaxDate = new DateTime(seasonYear, 09, 1).AddYears(-16),
                        Stats = true,
                        DraftVenue = "Mullins Hall",
                        DraftTime = "7:00 PM",
                        CreatedDate = DateTime.UtcNow,

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
