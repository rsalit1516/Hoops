using Hoops.Core.Models;

namespace Hoops.Core.Interface
{
    public interface IScheduleDivTeamsRepository : IRepository<ScheduleDivTeam>
    {
        int GetTeamNo(int scheduleNo, int teamNo);
        int GetTeamNo(int scheduleNo, int teamNo, int seasonId);
        int GetScheduleTeamNumber(int scheduleNo, int teamNumber, int seasonId);
    }
}
