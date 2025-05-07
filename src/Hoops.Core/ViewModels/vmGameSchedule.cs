using System;
using static Hoops.Core.Enum.GroupTypes;

namespace Hoops.Core.ViewModels
{
    public class vmGameSchedule
    {
        public int ScheduleGamesId { get; set; }
        public int DivisionId { get; set; }
        public int? CompanyId { get; set; }
        public int? SeasonId { get; set; }
        public string DivisionDescription { get; set; }
        public DateTime GameDate { get; set; }
        public String GameTimeString { get; set; }
        public DateTime GameTime { get; set; }
        public string LocationName { get; set; }
        public int GameNumber { get; set; }
        public int? VisitingTeamNumber { get; set; }
        public int? HomeTeamNumber { get; set; }
        public int VisitingTeamSeasonNumber { get; set; }
        public int HomeTeamSeasonNumber { get; set; }
        public string VisitingTeamName { get; set; }
        public string HomeTeamName { get; set; }
        public int ScheduleNumber { get; set; }
        public int HomeTeamScore { get; set; }
        public int VisitingTeamScore { get; set; }
        public string GameDescription { get; set; }
        public int VisitingTeamId { get; set; }
        public int HomeTeamId { get; set; }
        public GameTypes GameType { get; set; }
    }
}

