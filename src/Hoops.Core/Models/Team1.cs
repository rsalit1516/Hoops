using System;
using System.ComponentModel.DataAnnotations;

namespace Hoops.Core.Models
{
    public partial class Team1
    {
        [Key]
        public int TeamID { get; set; }
        public int? CompanyID { get; set; }
        public int? SeasonID { get; set; }
        public int? DivisionID { get; set; }
        public int? CoachID { get; set; }
        public int? AssCoachID { get; set; }
        public int? SponsorID { get; set; }
        public string TeamName { get; set; }
        public string TeamColor { get; set; }
        public int TeamColorID { get; set; }
        public string TeamNumber { get; set; }
        public int? Round1 { get; set; }
        public int? Round2 { get; set; }
        public int? Round3 { get; set; }
        public int? Round4 { get; set; }
        public int? Round5 { get; set; }
        public int? Round6 { get; set; }
        public int? Round7 { get; set; }
        public int? Round8 { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }
    }
}
