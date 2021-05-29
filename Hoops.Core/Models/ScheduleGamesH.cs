using System;
using System.Collections.Generic;

namespace Hoops.Core.Models
{
    public partial class ScheduleGamesH
    {
        public int ScheduleNumber { get; set; }
        public int GameNumber { get; set; }
        public Nullable<int> LocationNumber { get; set; }
        public Nullable<System.DateTime> GameDate { get; set; }
        public string GameTime { get; set; }
        public Nullable<int> VisitingTeamNumber { get; set; }
        public Nullable<int> HomeTeamNumber { get; set; }
        public Nullable<int> VisitingTeamScore { get; set; }
        public Nullable<int> HomeTeamScore { get; set; }
        public Nullable<bool> VisitingForfeited { get; set; }
        public Nullable<bool> HomeForfeited { get; set; }
    }
}
