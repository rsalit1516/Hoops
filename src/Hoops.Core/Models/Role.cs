using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Hoops.Core.Interface;

namespace Hoops.Core.Models
{
    public partial class Role : IAuditable
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
        public int? CreatedUser { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? ModifiedUser { get; set; }

        //public virtual User User { get; set; }
    }
}
