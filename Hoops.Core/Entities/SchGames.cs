using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class SchGames
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
        public bool Overtime { get; set; }
        public bool VisitingTeamForfeited { get; set; }
        public bool HomeTeamForfeited { get; set; }
        public bool Rainout { get; set; }
        public bool Cancelled { get; set; }
        public string GameComment { get; set; }
        public string ScheduleComment { get; set; }
        public int SchGames1 { get; set; }
    }
}
