using Hoops.Core.Models;
using Hoops.Core.Interface;
using Hoops.Infrastructure.Data;

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

        public int GetTeamNo(int scheduleNo, int teamNo, int seasonId)
        {
            var scheduleTeamNo = 0;
            var team = context.Set<ScheduleDivTeam>().FirstOrDefault(t =>
                t.ScheduleNumber == scheduleNo &&
                t.ScheduleTeamNumber == teamNo &&
                t.SeasonId == seasonId);
            if (team != null)
                scheduleTeamNo = team.TeamNumber;
            return scheduleTeamNo;
        }

        /// <summary>
        /// Reverse lookup: Gets the division-specific ScheduleTeamNumber from the season-wide TeamNumber
        /// </summary>
        /// <param name="scheduleNo">Schedule number</param>
        /// <param name="teamNumber">Season-wide team number (stored in ScheduleGames)</param>
        /// <param name="seasonId">Season ID</param>
        /// <returns>Division-specific ScheduleTeamNumber for frontend display</returns>
        public int GetScheduleTeamNumber(int scheduleNo, int teamNumber, int seasonId)
        {
            var team = context.Set<ScheduleDivTeam>().FirstOrDefault(t =>
                t.ScheduleNumber == scheduleNo &&
                t.TeamNumber == teamNumber &&
                t.SeasonId == seasonId);
            return team?.ScheduleTeamNumber ?? 0;
        }
    }
}