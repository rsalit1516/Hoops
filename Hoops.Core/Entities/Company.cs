using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class Company
    {
        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public int TimeZone { get; set; }
        public string ImageName { get; set; }
        public string EmailSender { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }
    }
}
