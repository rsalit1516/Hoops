using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class VwTeam
    {
        public int CompanyId { get; set; }
        public int? SeasonId { get; set; }
        public int TeamId { get; set; }
        public string TeamName { get; set; }
        public string TeamColor { get; set; }
        public int ColorId { get; set; }
        public string TeamNumber { get; set; }
        public int? CoachId { get; set; }
        public int? AssCoachId { get; set; }
        public int? DivisionId { get; set; }
        public int? SponsorId { get; set; }
        public int? SponsorProfileId { get; set; }
        public string CoachPhone { get; set; }
        public string CoachCell { get; set; }
        public string AsstPhone { get; set; }
        public string AsstCell { get; set; }
    }
}
