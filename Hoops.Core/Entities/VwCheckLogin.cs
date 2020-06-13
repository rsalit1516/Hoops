using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class VwCheckLogin
    {
        public int CompanyId { get; set; }
        public int TimeZone { get; set; }
        public string CompanyName { get; set; }
        public string EmailSender { get; set; }
        public string ImageName { get; set; }
        public int? SeasonId { get; set; }
        public int? SignUpSeasonId { get; set; }
        public string SeaDesc { get; set; }
        public int? HouseId { get; set; }
        public int UserId { get; set; }
        public int? UserType { get; set; }
        public string UserName { get; set; }
        public string Pword { get; set; }
        public string Password { get; set; }
        public DateTime? SignedDate { get; set; }
        public DateTime? SignedDateEnd { get; set; }
    }
}
