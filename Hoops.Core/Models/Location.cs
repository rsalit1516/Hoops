using System;
using System.Collections.Generic;

namespace Hoops.Core.Models
{
    public partial class Location
    {
        public int LocationNumber { get; set; }
        public string LocationName { get; set; }
        public string Notes { get; set; }
        public int? Id { get; set; }
    }
}
