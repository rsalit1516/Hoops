using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class VwCheckEncryption
    {
        public int Pwd { get; set; }
        public string UserName { get; set; }
        public DateTime? SignedDate { get; set; }
        public DateTime? SignedDateEnd { get; set; }
    }
}
