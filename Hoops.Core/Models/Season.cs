using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hoops.Core.Models
{
    [Table("Seasons")]
    public partial class Season
    {
        [Key]
        [Column("SeasonID")]
        public int SeasonId { get; set; }
        [Column("CompanyID")]
        public Nullable<int> CompanyId { get; set; }
        [Column("Sea_Desc")]
        public string Description { get; set; }
        public Nullable<System.DateTime> FromDate { get; set; }
        public Nullable<System.DateTime> ToDate { get; set; }
        [Display(Name = "Player Fee")]
        public Nullable<decimal> ParticipationFee { get; set; }
        public Nullable<decimal> SponsorFee { get; set; }
        public Nullable<decimal> ConvenienceFee { get; set; }
        public Nullable<bool> CurrentSeason { get; set; }
        public Nullable<bool> CurrentSchedule { get; set; }
        public Nullable<bool> CurrentSignUps { get; set; }
        public Nullable<System.DateTime> SignUpsDate { get; set; }
        [Column("SignUpsEND")]
        public Nullable<System.DateTime> SignUpsEnd { get; set; }
        public Nullable<bool> TestSeason { get; set; }
        public Nullable<bool> NewSchoolYear { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public string CreatedUser { get; set; }
        //public decimal PlayerFee { get; set; }
    }
}
