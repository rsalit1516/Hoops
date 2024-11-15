using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
