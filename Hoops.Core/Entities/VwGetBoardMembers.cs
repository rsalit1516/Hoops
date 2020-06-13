using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class VwGetBoardMembers
    {
        public int? Seq { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Phone { get; set; }
        public string Cellphone { get; set; }
        public string Workphone { get; set; }
        public string Email { get; set; }
        public int CompanyId { get; set; }
    }
}
