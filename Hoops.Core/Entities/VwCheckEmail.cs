using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class VwCheckEmail
    {
        public string Email { get; set; }
        public string Pword { get; set; }
        public string UserName { get; set; }
        public int CompanyId { get; set; }
    }
}
