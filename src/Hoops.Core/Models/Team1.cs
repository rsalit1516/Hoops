using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Hoops.Core.Models
{
    public partial class Team1
    {
        [Key]
        public int TeamID { get; set; }
        public Nullable<int> CompanyID { get; set; }
        public Nullable<int> SeasonID { get; set; }
        public Nullable<int> DivisionID { get; set; }
        public Nullable<int> CoachID { get; set; }
        public Nullable<int> AssCoachID { get; set; }
        public Nullable<int> SponsorID { get; set; }
        public string TeamName { get; set; }
        public string TeamColor { get; set; }
        public int TeamColorID { get; set; }
        public string TeamNumber { get; set; }
        public Nullable<int> Round1 { get; set; }
        public Nullable<int> Round2 { get; set; }
        public Nullable<int> Round3 { get; set; }
        public Nullable<int> Round4 { get; set; }
        public Nullable<int> Round5 { get; set; }
        public Nullable<int> Round6 { get; set; }
        public Nullable<int> Round7 { get; set; }
        public Nullable<int> Round8 { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public string CreatedUser { get; set; }
    }
}
