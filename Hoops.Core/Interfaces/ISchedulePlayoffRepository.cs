using System;
using System.Linq;
using Hoops.Core.Entities;

namespace Hoops.Infrastructure.Interface
{
    public interface ISchedulePlayoffRepository : IRepository<SchedulePlayoff>
    {
        IQueryable<SchedulePlayoff> GetByDate(DateTime date);
        SchedulePlayoff GetByScheduleAndGameNo(int scheduleNo, int gameNo);
        new void Delete(SchedulePlayoff entity);
        
    }
}
