using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hoops.Core.Models
{
    public partial class SponsorPayment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("PaymentID")]
        public int PaymentId { get; set; }
        [Column("CompanyID")]
        public Nullable<int> CompanyId { get; set; }
        [Column("SponsorProfileID")]
        public int SponsorProfileId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentType { get; set; }
        public Nullable<System.DateTime> TransactionDate { get; set; }
        public string TransactionNumber { get; set; }
        public string Memo { get; set; }
        [Column("ShoppingCartID")]
        public string ShoppingCartId { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public string CreatedUser { get; set; }

        [ForeignKey("SponsorProfileID")]
        public virtual SponsorProfile SponsorProfile { get; set; }
    }
}
