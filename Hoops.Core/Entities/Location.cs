using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class Location: CommonFields 
    {
        public int LocationNumber { get; set; }
        public string LocationName { get; set; }
        public string Notes { get; set; }
        public int? Id { get; set; }
    }
}
