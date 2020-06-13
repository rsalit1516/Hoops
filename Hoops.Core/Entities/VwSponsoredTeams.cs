using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class VwSponsoredTeams
    {
        public int CompanyId { get; set; }
        public int SeasonId { get; set; }
        public string SeaDesc { get; set; }
        public string TeamNumber { get; set; }
        public string DivDesc { get; set; }
        public decimal? SponsorFee { get; set; }
        public int? SponsorId { get; set; }
    }
}
