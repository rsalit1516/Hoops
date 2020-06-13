using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class VwHouseholds
    {
        public int CompanyId { get; set; }
        public int HouseId { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string Email { get; set; }
        public bool? EmailList { get; set; }
        public string SportsCard { get; set; }
        public int? Guardian { get; set; }
        public bool? FeeWaived { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }
        public string UserName { get; set; }
        public string Pword { get; set; }
    }
}
