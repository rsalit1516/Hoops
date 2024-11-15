using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hoops.Core.Models
{
    public partial class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("UserID")]
        public int UserId { get; set; }
        [Column("CompanyID")]
        public Nullable<int> CompanyId { get; set; }
        public string UserName { get; set; }
        public string Name { get; set; }
        [Column("PWord")]
        public string Pword { get; set; }
        public string PassWord { get; set; }
        public Nullable<int> UserType { get; set; }
        public Nullable<int> ValidationCode { get; set; }
        [Column("PeopleID")]
        public Nullable<int> PersonId { get; set; }
        //[ForeignKey("HouseID")]
        [Column("HouseID")]
        public int HouseId { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public string CreatedUser { get; set; }

        //public virtual Household Household { get; set; }
    }
}
