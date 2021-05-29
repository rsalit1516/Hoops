using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Hoops.Core.Models
{
    public partial class Message
    {
        [Key]
        public int MessID { get; set; }
        public Nullable<int> CompanyID { get; set; }
        public string MessScreen { get; set; }
        public Nullable<int> MessSeq { get; set; }
        public string MessageText { get; set; }
        public string LineText { get; set; }
        public Nullable<bool> Bold { get; set; }
        public Nullable<bool> UnderLn { get; set; }
        public Nullable<bool> Italic { get; set; }
        public string FontSize { get; set; }
        public string FontColor { get; set; }
        public string MessageLink { get; set; }
        public Nullable<System.DateTime> StartDate { get; set; }
        public Nullable<System.DateTime> EndDate { get; set; }
        public string CreatedUser { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
    }
}
