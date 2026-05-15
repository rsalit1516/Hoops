using System;

namespace Hoops.Core.ViewModels
{
    public class SponsorPaymentDto
    {
        public int PaymentId { get; set; }
        public int SponsorProfileId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentType { get; set; } = string.Empty;
        public DateTime? TransactionDate { get; set; }
        public string TransactionNumber { get; set; } = string.Empty;
        public string Memo { get; set; } = string.Empty;
    }
}
