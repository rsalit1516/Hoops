using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class Role
    {
        public decimal RoleId { get; set; }
        public decimal UserId { get; set; }
        public string ScreenName { get; set; }
        public string AccessType { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }
    }
}
