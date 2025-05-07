using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hoops.Core.Models
{
    public partial class Role
    {

        [Key]
        [Column("RollsID")]
        public int RoleId { get; set; }
        //[ForeignKey("UserID")]
        [Column("UserID")]
        public int UserId { get; set; }
        public string ScreenName { get; set; }
        public string AccessType { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }

        //public virtual User User { get; set; }
    }
}
