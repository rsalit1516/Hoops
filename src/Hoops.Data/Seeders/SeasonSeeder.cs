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
            var startyear = 2024;
            var seasons = new List<Season>
            {
                new Season
                {

                Description = "Summer " + startyear.ToString(),
                CurrentSchedule = false,
                CurrentSignUps = false,
                CurrentSeason = false,
                CompanyId = 1,
                FromDate = new DateTime(startyear, 6, 15),
                ToDate = new DateTime(startyear, 8, 31),
                ParticipationFee = 110

            },

            new Season{
                Description = "Spring " + startyear.ToString(),
                CurrentSchedule = false,
                CurrentSignUps = false,
                CurrentSeason = false,
                CompanyId = 1,
                FromDate = new DateTime(startyear, 3, 15),
                ToDate = new DateTime(startyear, 5, 16),
                ParticipationFee = 110
            },
           new Season
            {
                Description = "Winter " + startyear.ToString(),
                CurrentSchedule = false,
                CurrentSignUps = false,
                CurrentSeason = false,
                CompanyId = 1,
                FromDate = new DateTime(startyear, 11, 15),
                ToDate = new DateTime(++startyear, 3, 6),
                ParticipationFee = 110
            },
           new Season
            {
                Description = "Spring " + startyear.ToString(),
                CurrentSchedule = false,
                CurrentSignUps = false,
                CurrentSeason = false,
                CompanyId = 1,
                FromDate = new DateTime(startyear, 04, 15),
                ToDate = new DateTime(startyear, 6, 6),
                ParticipationFee = 110
            },
           new Season
            {
                Description = "Summer " + startyear.ToString(),
                CurrentSchedule = true,
                CurrentSignUps = true,
                CurrentSeason = true,
                CompanyId = 1,
                FromDate = new DateTime(startyear, 06, 15),
                ToDate = new DateTime(startyear, 8, 31),
                ParticipationFee = 110
            }
};

            foreach (var season in seasons)
            {
                await _seasonRepo.InsertAsync(season);
            }
            context.SaveChanges();
        }
    }
}
