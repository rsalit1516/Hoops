using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Hoops.Core.Entities
{
    public partial class ScheduleLocation: CommonFields
    {
        [Key]
        public int LocationNumber { get; set; }
        public string LocationName { get; set; }
        public string Notes { get; set; }
    }
}
