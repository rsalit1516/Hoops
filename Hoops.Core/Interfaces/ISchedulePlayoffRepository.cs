using System;
using System.Collections.Generic;
using System.Linq;
using Hoops.Core.Models;

namespace Hoops.Infrastructure.Interface
{
    public interface ISchedulePlayoffRepository : IRepository<SchedulePlayoff>
    {
        IQueryable<SchedulePlayoff> GetByDate(DateTime date);
        SchedulePlayoff GetByScheduleAndGameNo(int scheduleNo, int gameNo);
        List<SchedulePlayoff> GetGamesBySeasonId(int seasonId);
        IQueryable<SchedulePlayoff> GetGamesByDivisionId(int divisionId);
        new void Delete(SchedulePlayoff entity);
        
    }
}
