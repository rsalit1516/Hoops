using System;

namespace Hoops.Core.ViewModels
{
    public class SponsorSeasonDto
    {
        public int SponsorId { get; set; }
        public int SponsorProfileId { get; set; }
        public int? SeasonId { get; set; }
        public string SeasonDescription { get; set; } = string.Empty;
        public string ShirtName { get; set; } = string.Empty;
        public string ShirtSize { get; set; } = string.Empty;
        public decimal? SpoAmount { get; set; }
        public decimal? FeeId { get; set; }
        public bool? MailCheck { get; set; }
        public DateTime? AdExpiration { get; set; }
    }
}
