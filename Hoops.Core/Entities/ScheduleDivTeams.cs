using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class ScheduleDivTeam
    {
        public int ScheduleDivTeamId { get; set; }
        public int DivisionNumber { get; set; }
        public int TeamNumber { get; set; }
        public int ScheduleNumber { get; set; }
        public int ScheduleTeamNumber { get; set; }
        public int? HomeLocation { get; set; }
        public int? SeasonId { get; set; }

    }
}
