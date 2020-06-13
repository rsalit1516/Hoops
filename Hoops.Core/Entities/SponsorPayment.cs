using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class SponsorPayment
    {
        public int PaymentId { get; set; }
        public int? CompanyId { get; set; }
        public int SponsorProfileId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentType { get; set; }
        public DateTime? TransactionDate { get; set; }
        public string TransactionNumber { get; set; }
        public string Memo { get; set; }
        public string ShoppingCartId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }
    }
}
