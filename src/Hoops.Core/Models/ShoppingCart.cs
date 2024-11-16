using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Hoops.Core.Models
{
    public partial class ShoppingCart
    {
     [Key]
        public int CartID { get; set; }
        public int? CompanyID { get; set; }
        public int? SeasonID { get; set; }
        public int? HouseID { get; set; }
        public string Payer_ID { get; set; }
        public decimal? Payment_Gross { get; set; }
        public decimal? Payment_Fee { get; set; }
        public string Payer_Email { get; set; }
        public string Txn_ID { get; set; }
        public string Payment_status { get; set; }
        public string ErrorMessage { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }
    }
}
