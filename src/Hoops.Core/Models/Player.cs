using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Hoops.Core.Interface;

namespace Hoops.Core.Models
{
    public partial class Player : IAuditable
    {
        [Key]
        [Column("PlayerID")]
        public int PlayerId { get; set; }
        [Column("SeasonID")]
        public int? SeasonId { get; set; }
        [Column("DivisionID")]
        public int? DivisionId { get; set; }
        [Column("TeamID")]
        public int? TeamId { get; set; }
        [Column("PeopleID")]
        public int PersonId { get; set; }
        [Column("DraftID")]
        public string DraftId { get; set; }
        public string DraftNotes { get; set; }
        public int? Rating { get; set; }
        public int? Coach { get; set; }
        [Column("CoachID")]
        public int? CoachId { get; set; }
        public int? Sponsor { get; set; }
        [Column("SponsorID")]
        public int? SponsorId { get; set; }
        [Column("AD")]
        public bool? Ad { get; set; }
        public bool? Scholarship { get; set; }
        public bool? FamilyDisc { get; set; }
        public bool? Rollover { get; set; }
        public bool? OutOfTown { get; set; }
        [Column("RefundBatchID")]
        public int? RefundBatchId { get; set; }
        public DateTime? PaidDate { get; set; }
        public decimal? PaidAmount { get; set; }
        public decimal? BalanceOwed { get; set; }
        public string PayType { get; set; }
        public string NoteDesc { get; set; }
        public string CheckMemo { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? CreatedUser { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? ModifiedUser { get; set; }
        public bool? PlaysDown { get; set; }
        public bool? PlaysUp { get; set; }
        [Column("ShoppingCartID")]
        public int? ShoppingCartId { get; set; }

        [ForeignKey("PersonId")]
        public virtual Person Person { get; set; }
        [ForeignKey("DivisionId")]
        public virtual Division Division { get; set; }
        [ForeignKey("TeamId")]
        public virtual Team Team { get; set; }
        [ForeignKey("SeasonId")]
        public virtual Season Season { get; set; }
    }
    // public partial class UndraftedPlayer
    // {
    //     [Key]
    //     public int PlayerID { get; set; }
    //     public Nullable<int> PeopleID { get; set; }
    //     public string LastName { get; set; }
    //     public string FirstName { get; set; }
    //     public string Name { get; set; }
    //     public Nullable<int> Sponsor { get; set; }
    //     public int SponsorID { get; set; }
    //     public int DivisionID { get; set; }   
    //     public string DraftID { get; set; }
    //     public int? Rating { get; set; }
    // }
    // public partial class SeasonPlayer
    // {
    //     [Key]
    //     public int PlayerID { get; set; }
    //     public int PeopleID { get; set; }
    //     public string LastName { get; set; }
    //     public string FirstName { get; set; }
    //     public string Name { get; set; }
    //     public int? DivisionID { get; set; }
    //     public string Div_Desc { get; set; }
    //     public string DraftID { get; set; }
    //     public int? Rating { get; set; }
    //     public DateTime BirthDate { get; set; }
    //     public string Address1 { get; set; }
    //     public string City { get; set; }
    //     public string State { get; set; }
    //     public string ZipCode { get; set; }
    //     public string Phone { get; set; }
    //     public string Parent1 { get; set; }
    //     public string Parent2 { get; set; }
    //     public int Grade { get; set; }
    //     public decimal Balance { get; set; }
    //     public string DraftNotes { get; set; }
    // }

    //public virtual Division Division { get; set; }


}
