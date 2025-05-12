using System;
using System.Linq;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;

namespace Hoops.Core.Interface
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
