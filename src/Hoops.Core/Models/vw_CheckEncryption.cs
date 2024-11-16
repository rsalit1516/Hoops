using System;
using System.Collections.Generic;

namespace Hoops.Core.Models
{
    public partial class vw_CheckEncryption
    {
        public int PWD { get; set; }
        public string UserName { get; set; }
        public DateTime? SignedDate { get; set; }
        public DateTime? SignedDateEnd { get; set; }
    }
}
