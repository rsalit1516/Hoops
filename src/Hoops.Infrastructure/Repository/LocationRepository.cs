using Hoops.Core.Models;
using Hoops.Infrastructure.Data;
using Hoops.Core.Interface;
using Microsoft.EntityFrameworkCore;

namespace Hoops.Infrastructure.Repository
{
    public class LocationRepository : EFRepository<Location>, ILocationRepository
    {
        public LocationRepository(hoopsContext context) : base(context) {}
 
        public Location GetByName( string locationName)
        {
            var location = context.Set<Location>().FirstOrDefault(c => c.LocationName == locationName);
            return location;
        }

        public new async Task<IEnumerable<Location>> GetAll()
        {
            return await context.Location
                .OrderBy(c => c.LocationName)
                .ToListAsync();
        }
        public override Location Insert(Location entity)
        {
            //if (entity.Id == 0)
            //     entity.Id = context.Set<Location>().Any() ? context.Set<Location>().Max(c => c.Id) + 1 : 1;
            return base.Insert(entity);
        }
    }
}
