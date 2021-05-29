using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class VwRoles
    {
        public int CompanyId { get; set; }
        public int RoleId { get; set; }
        public int UserId { get; set; }
        public string ScreenName { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }
    }
}
