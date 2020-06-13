using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class SpecialUserQuery
    {
        public string ScheduleName { get; set; }
        public DateTime? GameDate { get; set; }
        public short? HomeTeamScheduleTeamNumber { get; set; }
        public short? VisitingTeamScheduleTeamNumber { get; set; }
        public string HomeTeamName { get; set; }
        public string VisitingTeamName { get; set; }
    }
}
