using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hoops.Core.Models
{
    public partial class ScheduleDivTeam
    {
        public int DivisionNumber { get; set; }
        public int TeamNumber { get; set; }
        public int ScheduleNumber { get; set; }
        public int ScheduleTeamNumber { get; set; }
        public int HomeLocation { get; set; }
        public int SeasonId { get; set; }
        
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ScheduleDivTeamsId { get; set; }
    }
}
