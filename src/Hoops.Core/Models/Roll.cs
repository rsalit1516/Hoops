using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Hoops.Core.Models
{
    public partial class Roll
    {
        [Key]
        public decimal RollsID { get; set; }
        public decimal UserID { get; set; }
        public string ScreenName { get; set; }
        public string AccessType { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public string CreatedUser { get; set; }
    }
}
