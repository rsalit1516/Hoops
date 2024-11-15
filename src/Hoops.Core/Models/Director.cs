using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hoops.Core.Models
{
    public partial class Director
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("ID")]
        public int DirectorId { get; set; }
        [Column("CompanyID")]
        public Nullable<int> CompanyId { get; set; }
        [Column("PeopleID")]
        public int PersonId { get; set; }
        public Nullable<int> Seq { get; set; }
        public string Title { get; set; }
        public byte[] Photo { get; set; }
        public string PhonePref { get; set; }
        public Nullable<int> EmailPref { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public string CreatedUser { get; set; }

        // [ForeignKey("PeopleID")]
        // public virtual Person People {get; set;}
    }
}
