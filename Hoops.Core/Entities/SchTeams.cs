using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class SchTeams
    {
        public int DivisionNumber { get; set; }
        public int TeamNumber { get; set; }
        public int ScheduleNumber { get; set; }
        public short ScheduleTeamNumber { get; set; }
        public int HomeLocation { get; set; }
    }
}
