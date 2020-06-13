using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class VwRoles
    {
        public int CompanyId { get; set; }
        public decimal RoleId { get; set; }
        public decimal UserId { get; set; }
        public string ScreenName { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }
    }
}
