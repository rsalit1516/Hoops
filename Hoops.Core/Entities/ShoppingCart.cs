using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class ShoppingCart
    {
        public int CartId { get; set; }
        public int? CompanyId { get; set; }
        public int? SeasonId { get; set; }
        public int? HouseId { get; set; }
        public string PayerId { get; set; }
        public decimal? PaymentGross { get; set; }
        public decimal? PaymentFee { get; set; }
        public string PayerEmail { get; set; }
        public string TxnId { get; set; }
        public string PaymentStatus { get; set; }
        public string ErrorMessage { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }
    }
}
