using System.Collections.Generic;
using System.Linq;
using Hoops.Core.Models;
using Csbc.Infrastructure;
using Hoops.Infrastructure.Interface;
using Hoops.Core;

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

        public new IEnumerable<Location> GetAll()
        {
            return context.Location
            .OrderBy(c => c.LocationName);
        }
        public override Location Insert(Location entity)
        {
            if (entity.Id == 0)
                entity.Id = context.Set<Location>().Any() ? context.Set<Location>().Max(c => c.Id) + 1 : 1;
            return base.Insert(entity);
        }
    }
}
