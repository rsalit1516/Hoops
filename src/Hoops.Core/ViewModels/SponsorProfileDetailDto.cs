using System;

namespace Hoops.Core.ViewModels
{
    public class SponsorProfileDetailDto
    {
        public int SponsorProfileId { get; set; }
        public int CompanyId { get; set; }
        public int? HouseId { get; set; }
        public string SpoName { get; set; } = string.Empty;
        public string ContactName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string Zip { get; set; } = string.Empty;
        public string TypeOfBuss { get; set; } = string.Empty;
        public bool ShowAd { get; set; }
        public DateTime? AdExpiration { get; set; }
    }
}
