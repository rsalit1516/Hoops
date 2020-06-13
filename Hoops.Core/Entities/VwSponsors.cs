using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class VwSponsors
    {
        public int CompanyId { get; set; }
        public int? SeasonId { get; set; }
        public int SponsorId { get; set; }
        public int? SponsorProfileId { get; set; }
        public string SpoName { get; set; }
        public string ShirtName { get; set; }
        public string Address { get; set; }
        public string ContactName { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Url { get; set; }
        public string ShirtSize { get; set; }
        public string TypeOfBuss { get; set; }
        public int Color1Id { get; set; }
        public string Color1name { get; set; }
        public int Color2Id { get; set; }
        public string Color2name { get; set; }
        public decimal FeeId { get; set; }
        public decimal? Balance { get; set; }
    }
}
