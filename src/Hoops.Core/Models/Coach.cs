using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hoops.Core.Models
{
    public partial class Coach
    {
        [Key]
        [Column("CoachID")]
        public int CoachId { get; set; }
        [Column("CompanyID")]
        public Nullable<int> CompanyId { get; set; }
        [Column("SeasonID")]
        public Nullable<int> SeasonId { get; set; }
        [Column("PeopleID")]
        public int PersonId { get; set; }
        [Column("PlayerID")]
        public Nullable<int> PlayerId { get; set; }
        public string ShirtSize { get; set; }
        public string CoachPhone { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public string CreatedUser { get; set; }

        [ForeignKey("PeopleID")]
        public virtual Person Person { get; set; }
    }
}
