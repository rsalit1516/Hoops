using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class Team
    {
        public int TeamId { get; set; }
        public int? CompanyId { get; set; }
        public int? SeasonId { get; set; }
        public int? DivisionId { get; set; }
        public int? CoachId { get; set; }
        public int? AssCoachId { get; set; }
        public int? SponsorId { get; set; }
        public string TeamName { get; set; }
        public string TeamColor { get; set; }
        public int TeamColorId { get; set; }
        public string TeamNumber { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }
        public virtual Color Color { get; set; }
        // public virtual Coach Coach { get; set; }
    }
}
