using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hoops.Core.ViewModels;
using Hoops.Core.Entities;

namespace Hoops.Infrastructure.Interface
{
    public interface IScheduleGameRepository : IRepository<ScheduleGame>
    {
        IQueryable<ScheduleGame> GetByDate(DateTime date);
        ScheduleGame GetByScheduleAndGameNo(int scheduleNo, int gameNo);
        Task<IEnumerable<ScheduleGame>> GetSeasonGamesAsync(int seasonId);
        new int Update(ScheduleGame scheduleGame);
        IEnumerable<ScheduleStandingsVM> GetStandings(int divisionId);
    }
}
