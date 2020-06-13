using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class VwGetPlayers
    {
        public int CompanyId { get; set; }
        public int PlayerId { get; set; }
        public string DraftId { get; set; }
        public string DraftNotes { get; set; }
        public string DivDesc { get; set; }
        public string TeamName { get; set; }
        public string TeamNumber { get; set; }
        public string TeamColor { get; set; }
        public int? TeamId { get; set; }
        public int? Rating { get; set; }
        public int? DivisionId { get; set; }
        public DateTime? PaidDate { get; set; }
        public decimal? PaidAmount { get; set; }
        public decimal? BalanceOwed { get; set; }
        public string PayType { get; set; }
        public string NoteDesc { get; set; }
        public string CheckMemo { get; set; }
        public int? SeasonId { get; set; }
        public int? PersonId { get; set; }
        public int? CoachId { get; set; }
        public int? SponsorId { get; set; }
        public int? Sponsor { get; set; }
        public bool? Scholarship { get; set; }
        public bool? FamilyDisc { get; set; }
        public bool? Rollover { get; set; }
        public bool? OutOfTown { get; set; }
        public bool? AthleticDirector { get; set; }
        public bool? PlaysDown { get; set; }
        public bool? PlaysUp { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string SpoName { get; set; }
        public DateTime? BirthDate { get; set; }
        public int? HouseId { get; set; }
        public string HouseName { get; set; }
        public string HousePhone { get; set; }
        public string Gender { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? RefundBatchId { get; set; }
    }
}
