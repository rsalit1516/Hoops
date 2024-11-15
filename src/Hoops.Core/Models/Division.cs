using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Hoops.Core.Models
{
    public partial class Division
    {
        [Key]
        public int DivisionId { get; set; }
        public Nullable<int> CompanyId { get; set; }
        public Nullable<int> SeasonId { get; set; }
        public string DivisionDescription { get; set; }
        public Nullable<int> DirectorId { get; set; }
        public Nullable<int> CoDirectorId { get; set; }
        public string Gender { get; set; }
        public Nullable<System.DateTime> MinDate { get; set; }
        public Nullable<System.DateTime> MaxDate { get; set; }
        public string Gender2 { get; set; }
        public Nullable<System.DateTime> MinDate2 { get; set; }
        public Nullable<System.DateTime> MaxDate2 { get; set; }
        public string DraftVenue { get; set; }
        public Nullable<System.DateTime> DraftDate { get; set; }
        public string DraftTime { get; set; }
        public bool Stats { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public string CreatedUser { get; set; }

        // [ForeignKey("DirectorID")]
        // public virtual Person Director { get; set; }
    }
    
}
