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
        public int? CompanyId { get; set; }
        [Column("Sea_Desc")]
        public string Description { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        [Display(Name = "Player Fee")]
        public decimal? ParticipationFee { get; set; }
        public decimal? SponsorFee { get; set; }
        public decimal? ConvenienceFee { get; set; }
        public bool? CurrentSeason { get; set; }
        public bool? CurrentSchedule { get; set; }
        public bool? CurrentSignUps { get; set; }
        public DateTime? SignUpsDate { get; set; }
        [Column("SignUpsEND")]
        public DateTime? SignUpsEnd { get; set; }
        public bool? TestSeason { get; set; }
        public bool? NewSchoolYear { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }
        //public decimal PlayerFee { get; set; }
    }
}
