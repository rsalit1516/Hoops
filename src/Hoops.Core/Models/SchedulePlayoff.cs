using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hoops.Core.Models
{
    public partial class SchedulePlayoff
    {
        [Key]
        [Column("SchedulePlayoffID")]
        public int SchedulePlayoffId { get; set; }
        
        public int ScheduleNumber { get; set; }
        public int GameNumber { get; set; }
        [ForeignKey("Location")]
        public int? LocationNumber { get; set; }
        public DateTime? GameDate { get; set; }
        public string GameTime { get; set; }
        public string VisitingTeam { get; set; }
        public string HomeTeam { get; set; }
        public string Descr { get; set; }
        public int? VisitingTeamScore { get; set; }
        public int? HomeTeamScore { get; set; }
        public int DivisionId { get; set; }
    }
}
