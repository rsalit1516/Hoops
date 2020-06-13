using System;

namespace Hoops.Core.Entities
{
    public class SponsorFee
    {
        public int SponsorFeeId { get; set; }
        public string FeeName { get; set; }
        public decimal Amount { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedUser { get; set; }
    }
}
