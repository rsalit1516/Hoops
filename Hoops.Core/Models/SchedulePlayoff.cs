using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hoops.Core.Models
{
    public partial class SchedulePlayoff
    {
        [Key, Column(Order = 0)]
        public int ScheduleNumber { get; set; }
        [Key, Column(Order = 1)]
        public int GameNumber { get; set; }
        public Nullable<int> LocationNumber { get; set; }
        public Nullable<System.DateTime> GameDate { get; set; }
        public string GameTime { get; set; }
        public string VisitingTeam { get; set; }
        public string HomeTeam { get; set; }
        public string Descr { get; set; }
        public Nullable<int> VisitingTeamScore { get; set; }
        public Nullable<int> HomeTeamScore { get; set; }
        public int DivisionId { get; set; }
        public int? SchedulePlayoffId { get; set; }
    }
}
