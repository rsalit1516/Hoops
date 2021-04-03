using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Hoops.Core.Entities
{
    public partial class Role
    {
        [Key]
        public int RoleId { get; set; }
        public int UserId { get; set; }
        public string ScreenName { get; set; }
        public string AccessType { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }
    }
}
