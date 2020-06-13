using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class Player
    {
        public int PlayerId { get; set; }
        public int? CompanyId { get; set; }
        public int? SeasonId { get; set; }
        public int? DivisionId { get; set; }
        public int? TeamId { get; set; }
        public int? PersonId { get; set; }
        public string DraftId { get; set; }
        public string DraftNotes { get; set; }
        public int? Rating { get; set; }
        public int? Coach { get; set; }
        public int? CoachId { get; set; }
        public int? Sponsor { get; set; }
        public int? SponsorId { get; set; }
        public bool? Ad { get; set; }
        public bool? Scholarship { get; set; }
        public bool? FamilyDisc { get; set; }
        public bool? Rollover { get; set; }
        public bool? OutOfTown { get; set; }
        public int? RefundBatchId { get; set; }
        public DateTime? PaidDate { get; set; }
        public decimal? PaidAmount { get; set; }
        public decimal? BalanceOwed { get; set; }
        public string PayType { get; set; }
        public string NoteDesc { get; set; }
        public string CheckMemo { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }
        public bool? PlaysDown { get; set; }
        public bool? PlaysUp { get; set; }
        public int? ShoppingCartId { get; set; }
        public virtual Person Person { get; set; }
        public virtual Team Team { get; set; }
        public virtual Division Division { get; set; }
        public virtual Season Season { get; set; }
    }
}
