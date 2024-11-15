using System;
using System.Collections.Generic;

namespace Hoops.Core.Models
{
    public partial class vw_CheckEmail
    {
        public string email { get; set; }
        public string PWord { get; set; }
        public string UserName { get; set; }
        public int CompanyID { get; set; }
    }
}
