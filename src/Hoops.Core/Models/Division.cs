using System;
using System.ComponentModel.DataAnnotations;

namespace Hoops.Core.Models
{
    public partial class Division
    {
        [Key]
        public int DivisionId { get; set; }
        public int? CompanyId { get; set; }
        public int? SeasonId { get; set; }
        public string DivisionDescription { get; set; }
        public int? DirectorId { get; set; }
        public int? CoDirectorId { get; set; }
        public string Gender { get; set; }
        public DateTime? MinDate { get; set; }
        public DateTime? MaxDate { get; set; }
        public string Gender2 { get; set; }
        public DateTime? MinDate2 { get; set; }
        public DateTime? MaxDate2 { get; set; }
        public string DraftVenue { get; set; }
        public DateTime? DraftDate { get; set; }
        public string DraftTime { get; set; }
        public bool Stats { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }

        // [ForeignKey("DirectorID")]
        // public virtual Person Director { get; set; }
    }

}
