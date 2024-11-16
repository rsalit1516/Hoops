using System;
using System.Collections.Generic;

namespace Hoops.Core.Models
{
    public partial class vw_AllSponsors
    {
        public int CompanyID { get; set; }
        public int SponsorProfileID { get; set; }
        public int? HouseID { get; set; }
        public string spoName { get; set; }
        public string Address { get; set; }
        public string ContactName { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string URL { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }
        public decimal? Balance { get; set; }
    }
}
