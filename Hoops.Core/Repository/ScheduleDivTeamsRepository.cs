using Hoops.Core.Entities;
using Csbc.Infrastructure;
using Hoops.Infrastructure.Interface;
using System.Linq;

namespace Hoops.Infrastructure.Repository
{
    public class ScheduleDivTeamsRepository : EFRepository<ScheduleDivTeam>, IScheduleDivTeamsRepository
    {
        public ScheduleDivTeamsRepository(hoopsContext context) : base(context) { }

        public int GetTeamNo(int scheduleNo, int teamNo)
        {
            var scheduleTeamNo = 0;
            var team = context.Set<ScheduleDivTeam>().FirstOrDefault(t => t.ScheduleNumber == scheduleNo && t.ScheduleTeamNumber == teamNo);
            if (team != null)
                scheduleTeamNo = team.TeamNumber;
            return scheduleTeamNo;
        }
    }
}