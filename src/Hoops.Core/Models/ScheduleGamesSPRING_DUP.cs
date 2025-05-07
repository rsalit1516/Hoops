using System;

namespace Hoops.Core.Models
{
    public partial class ScheduleGamesSPRING_DUP
    {
        public int ScheduleNumber { get; set; }
        public int GameNumber { get; set; }
        public int LocationNumber { get; set; }
        public DateTime GameDate { get; set; }
        public DateTime GameTime { get; set; }
        public int VisitingTeamNumber { get; set; }
        public int HomeTeamNumber { get; set; }
        public short VisitingTeamScore { get; set; }
        public short HomeTeamScore { get; set; }
    }
}
