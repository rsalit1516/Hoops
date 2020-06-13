using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class SponsorProfile
    {
        public int CompanyId { get; set; }
        public int SponsorProfileId { get; set; }
        public int? HouseId { get; set; }
        public string ContactName { get; set; }
        public string SpoName { get; set; }
        public string Email { get; set; }
        public string Url { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string Phone { get; set; }
        public string TypeOfBuss { get; set; }
        public bool? ShowAd { get; set; }
        public DateTime? AdExpiration { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }
    }
}
