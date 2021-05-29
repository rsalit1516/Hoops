using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hoops.Core.Models
{
    public partial class ScheduleDivTeam
    {
        [Column(Order=0), Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int DivisionNumber { get; set; }
        [Column(Order = 1), Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int TeamNumber { get; set; }
        public int ScheduleNumber { get; set; }
        public int ScheduleTeamNumber { get; set; }
        public int HomeLocation { get; set; }
        public int SeasonId { get; set; }
        public int? ScheduleDivTeamId { get; set; }
    }
}
