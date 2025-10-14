using System;

namespace Hoops.Functions.Models
{
    // Lightweight DTO returned by Functions to avoid navigation cycles
    public class SeasonDto
    {
        public int SeasonId { get; set; }
        public int? CompanyId { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public decimal? ParticipationFee { get; set; }
        public decimal? SponsorFee { get; set; }
        public decimal? ConvenienceFee { get; set; }
        public bool? CurrentSeason { get; set; }
        public bool? CurrentSchedule { get; set; }
        public bool? CurrentSignUps { get; set; }
        public DateTime? SignUpsDate { get; set; }
        public DateTime? SignUpsEnd { get; set; }
        public bool? TestSeason { get; set; }
        public bool? NewSchoolYear { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? CreatedUser { get; set; }
    }
}
