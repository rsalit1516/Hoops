using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class VwSeason
    {
        public int CompanyId { get; set; }
        public int SeasonId { get; set; }
        public string SeaDesc { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public decimal? ParticipationFee { get; set; }
        public decimal? SponsorFee { get; set; }
        public decimal? SponsorFeeDiscounted { get; set; }
        public decimal? ConvenienceFee { get; set; }
        public bool? CurrentSeason { get; set; }
        public bool? CurrentSchedule { get; set; }
        public bool? CurrentSignUps { get; set; }
        public DateTime? SignUpsDate { get; set; }
        public DateTime? SignUpsEnd { get; set; }
        public bool? TestSeason { get; set; }
        public bool? NewSchoolYear { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }
    }
}
