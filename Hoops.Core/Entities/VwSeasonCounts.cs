using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class VwSeasonCounts
    {
        public int CompanyId { get; set; }
        public int? SeasonId { get; set; }
        public string Gender { get; set; }
        public DateTime? MinDate { get; set; }
        public int DivisionId { get; set; }
        public string DivDesc { get; set; }
        public int? Total { get; set; }
        public int? Coaches { get; set; }
        public int? Sponsors { get; set; }
        public int? TotalOr { get; set; }
        public int? CoachesOr { get; set; }
        public int? SponsorsOr { get; set; }
    }
}
