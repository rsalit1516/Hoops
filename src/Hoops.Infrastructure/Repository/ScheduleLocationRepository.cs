﻿using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Infrastructure.Data;

namespace Hoops.Infrastructure.Repository
{
    public class ScheduleLocationRepository : EFRepository<ScheduleLocation>, IScheduleLocationRepository
    {
        
        public ScheduleLocationRepository(hoopsContext context) : base(context) { }

        public override ScheduleLocation Insert(ScheduleLocation entity)
        {
            if (entity.LocationNumber == 0)
            {
                entity.LocationNumber = context.Set<ScheduleLocation>().Any() ? (context.Set<ScheduleLocation>().Max(p => p.LocationNumber) + 1) : 1;
            }
            context.Set<ScheduleLocation>().Add(entity);
            context.SaveChanges();
            return entity;
        }

 
    }
}
