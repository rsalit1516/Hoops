using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class VwUsers
    {
        public int CompanyId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Pword { get; set; }
        public string PassWord { get; set; }
        public int? UserType { get; set; }
        public int Discontinued { get; set; }
        public int? PersonId { get; set; }
        public int? HouseId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }
    }
}
