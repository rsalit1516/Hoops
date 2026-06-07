using System;

namespace Hoops.Functions.Models;

public sealed class PlayerDto
{
    public int PlayerId { get; set; }
    public int? SeasonId { get; set; }
    public int? DivisionId { get; set; }
    public int? TeamId { get; set; }
    public int PersonId { get; set; }
    public string? DraftId { get; set; }
    public string? DraftNotes { get; set; }
    public int? Rating { get; set; }
    public int? CoachId { get; set; }
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
    public string? PayType { get; set; }
    public string? NoteDesc { get; set; }
    public string? CheckMemo { get; set; }
    public DateTime? CreatedDate { get; set; }
    public int? CreatedUser { get; set; }
    public DateTime? ModifiedDate { get; set; }
    public int? ModifiedUser { get; set; }
    public bool? PlaysDown { get; set; }
    public bool? PlaysUp { get; set; }
    public int? ShoppingCartId { get; set; }
}
