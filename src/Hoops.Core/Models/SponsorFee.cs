using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hoops.Core.Models
{
    public class SponsorFee
    {
        public int SponsorFeeId { get; set; }
        [Column("Name")]
        public string FeeName { get; set; }
        public decimal Amount { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedUser { get; set; }
    }
}
