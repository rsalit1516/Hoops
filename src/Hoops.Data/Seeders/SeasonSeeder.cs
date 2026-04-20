using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Core.Interface;
using Hoops.Infrastructure.Repository;
using Hoops.Infrastructure.Data;
using System.Linq;
using Microsoft.Extensions.Logging;

namespace Hoops.Data.Seeders
{
    public class SeasonSeeder : ISeeder<Season>
    {
        public hoopsContext context { get; private set; }
        private readonly ISeasonRepository _seasonRepo;
        private readonly ILogger<SeasonSeeder> _logger;

        public SeasonSeeder(ISeasonRepository seasonRepo, hoopsContext context, ILogger<SeasonSeeder> logger)
        {
            this.context = context;
            _seasonRepo = seasonRepo;
            _logger = logger;
        }

        public async Task DeleteAllAsync()
        {
            var records = await _seasonRepo.GetAllAsync();
            _logger.LogDebug("Found {Count} seasons to delete", records.Count());
            foreach (var record in records)
            {
                _logger.LogDebug("Attempting to delete Season ID: {SeasonId}, Name: {Description}", record.SeasonId, record.Description);
                await _seasonRepo.DeleteAsync(record.SeasonId);
            }
        }
        public async Task SeedAsync()
        {
            var seasons = BuildSeasonList(DateTime.Today);

            foreach (var season in seasons)
            {
                await _seasonRepo.InsertAsync(season);
            }
            context.SaveChanges();
        }

        /// <summary>
        /// Builds a 4-season dataset relative to today's date:
        ///   [completed -2] → [completed -1] → [current, in-progress] → [next, setup-only / no games]
        ///
        /// Season calendar:
        ///   Winter : Jan  6 – Mar 28
        ///   Spring : Apr  7 – Jun  6
        ///   Summer : Jun 15 – Aug 31
        ///   Fall   : Sep  1 – Dec 15
        ///
        /// Flags:
        ///   Completed  → CurrentSeason=false, CurrentSchedule=false, CurrentSignUps=false
        ///   Current    → CurrentSeason=true,  CurrentSchedule=true,  CurrentSignUps=false
        ///   Next/Setup → CurrentSeason=false, CurrentSchedule=false, CurrentSignUps=true
        /// </summary>
        private static List<Season> BuildSeasonList(DateTime today)
        {
            // Season definitions in calendar order (index 0–3)
            var names      = new[] { "Winter", "Spring", "Summer", "Fall" };
            var fromMonths = new[] { 1,  4,  6,  9 };
            var fromDays   = new[] { 6,  7, 15,  1 };
            var toMonths   = new[] { 3,  6,  8, 12 };
            var toDays     = new[] { 28, 6, 31, 15 };

            // Determine which season index we are currently in
            int currentIndex;
            if (today.Month <= 3)
                currentIndex = 0; // Winter
            else if (today.Month <= 5 || (today.Month == 6 && today.Day < 15))
                currentIndex = 1; // Spring
            else if (today.Month <= 8)
                currentIndex = 2; // Summer
            else
                currentIndex = 3; // Fall

            var result = new List<Season>();

            // Generate offsets -2 (oldest completed) to +1 (next/setup)
            for (int offset = -2; offset <= 1; offset++)
            {
                var idx = currentIndex + offset;
                var yearAdjust = 0;

                // Normalise idx into [0, 3] and carry year over/under
                while (idx < 0)  { idx += 4; yearAdjust--; }
                while (idx >= 4) { idx -= 4; yearAdjust++; }

                var year = today.Year + yearAdjust;

                result.Add(new Season
                {
                    Description      = $"{names[idx]} {year}",
                    FromDate         = new DateTime(year, fromMonths[idx], fromDays[idx]),
                    ToDate           = new DateTime(year, toMonths[idx],   toDays[idx]),
                    CurrentSeason    = offset == 0,
                    CurrentSchedule  = offset == 0,
                    CurrentSignUps   = offset == 1,
                    CompanyId        = 1,
                    ParticipationFee = 110,
                    CreatedDate      = DateTime.UtcNow,
                });
            }

            return result;
        }
    }
}
