using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class VwSeasonSponsors
    {
        public int SponsorProfileId { get; set; }
        public string DivDesc { get; set; }
        public string TeamNumber { get; set; }
        public string Player { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string Phone { get; set; }
        public string SpoName { get; set; }
        public decimal? AmtPaid { get; set; }
        public string ContactName { get; set; }
        public int? SeasonId { get; set; }
        public DateTime? MinDate { get; set; }
        public string Gender { get; set; }
        public int CompanyId { get; set; }
        public string OnlineFlag { get; set; }
        public decimal? FeeId { get; set; }
        public string Url { get; set; }
    }
}
