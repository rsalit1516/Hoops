using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Hoops.Core.Entities
{
    public partial class SchedulePlayoff
    {
        // public int SchedulePlayoffId { get; set; }
        [Key]
        public int? ScheduleNumber { get; set; }
        [Key]
        public int? GameNumber { get; set; }
        public int? LocationNumber { get; set; }
        public DateTime? GameDate { get; set; }
        public string GameTime { get; set; }
        public string VisitingTeam { get; set; }
        public string HomeTeam { get; set; }
        public string Descr { get; set; }
        public int? VisitingTeamScore { get; set; }
        public int? HomeTeamScore { get; set; }
        public int? DivisionId { get; set; }
    }
}
