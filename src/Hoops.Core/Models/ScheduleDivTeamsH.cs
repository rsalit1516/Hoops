using System;
using System.Collections.Generic;

namespace Hoops.Core.Models
{
    public partial class ScheduleDivTeamsH
    {
        public int DivisionNumber { get; set; }
        public int TeamNumber { get; set; }
        public int ScheduleNumber { get; set; }
        public int ScheduleTeamNumber { get; set; }
        public int? HomeLocation { get; set; }
    }
}
