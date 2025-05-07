using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hoops.Core.Models
{
    [Table("Teams")]
    public partial class Team
    {
        [Key]
        [Column("TeamID")]
        public int TeamId { get; set; }
        [Column("DivisionID")]
        public int DivisionId { get; set; }
        // [Column("CompanyID")]
        // public Nullable<int> CompanyId { get; set; }
        [Column("SeasonID")]
        public int? SeasonId { get; set; }
        [Column("CoachID")]
        public int? CoachId { get; set; }
        [Column("AssCoachID")]
        public int? AssCoachId { get; set; }
        [Column("SponsorID")]
        public int? SponsorId { get; set; }
        [MaxLength(50)]
        public string TeamName { get; set; }
        [MaxLength(50)]
        public string TeamColor { get; set; }
        [Column("TeamColorID")]
        public int TeamColorId { get; set; }
        [MaxLength(4)]
        public string TeamNumber { get; set; }
        public int? Round1 { get; set; }
        public int? Round2 { get; set; }
        public int? Round3 { get; set; }
        public int? Round4 { get; set; }
        public int? Round5 { get; set; }
        public int? Round6 { get; set; }
        public int? Round7 { get; set; }
        public int? Round8 { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }

        // [ForeignKey("SeasonID")]
        // public virtual Season Season { get; set; }
        // [ForeignKey("DivisionID")]
        // public virtual Division Division { get; set; }
        // [ForeignKey("CoachID")]
        // public virtual Coach Coach { get; set; }
        // [ForeignKey("AssCoachID")]
        // public virtual Coach AsstCoach { get; set; }

        // [ForeignKey("TeamColorID")]
        // public virtual Color Color { get; set; }

    }
}
