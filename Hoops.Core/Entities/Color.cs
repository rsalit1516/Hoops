using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class Color
    {
        public int ColorId { get; set; }
        public int? CompanyId { get; set; }
        public string ColorName { get; set; }
        public bool? Discontinued { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }
    }
}
