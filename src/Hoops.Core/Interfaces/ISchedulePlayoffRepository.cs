using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;

namespace Hoops.Infrastructure.Interface
{
    public interface ISchedulePlayoffRepository : IRepository<SchedulePlayoff>
    {
        IQueryable<SchedulePlayoff> GetByDate(DateTime date);
        SchedulePlayoff GetByScheduleAndGameNo(int scheduleNo, int gameNo);
        IQueryable<PlayoffGameVm> GetGamesBySeasonId(int seasonId);
        IQueryable<SchedulePlayoff> GetGamesByDivisionId(int divisionId);
        new void Delete(SchedulePlayoff entity);
        
    }
}
