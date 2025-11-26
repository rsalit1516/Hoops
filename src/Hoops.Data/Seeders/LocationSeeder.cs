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
    public class LocationSeeder : ISeeder<Location>
    {
        public hoopsContext context { get; private set; }
        private readonly ILocationRepository _locationRepo;
        private readonly ILogger<LocationSeeder> _logger;

        public LocationSeeder(ILocationRepository locationRepo, hoopsContext context, ILogger<LocationSeeder> logger)
        {
            this.context = context;
            _locationRepo = locationRepo;
            _logger = logger;
        }

        public async Task DeleteAllAsync()
        {
            var records = await _locationRepo.GetAllAsync();
            _logger.LogDebug("Found {Count} locations to delete", records.Count());
            foreach (var record in records)
            {
                _logger.LogDebug("Attempting to delete Location ID: {LocationNumber}, Name: {LocationName}", record.LocationNumber, record.LocationName);
                await _locationRepo.DeleteAsync(record.LocationNumber);
            }
        }
        public async Task SeedAsync()
        {
            // Remove explicit LocationNumber assignment - let database auto-generate identity values
            var locations = new List<Location>
            {
                new Location
                {
                    LocationName = "Mini Back",
                },
                new Location
                {
                    LocationName = "Mini Front",
                },
                new Location
                {
                    LocationName = "Gym West",
                },
                new Location
                {
                    LocationName = "Gym Middle",
                },
                new Location
                {
                    LocationName = "Gym East",
                }
            };

            foreach (var content in locations)
            {
                await _locationRepo.InsertAsync(content);
            }
            context.SaveChanges();
        }
    }
}
