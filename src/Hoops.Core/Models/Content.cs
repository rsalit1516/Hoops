using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Hoops.Core.Models
{
    public partial class Content
    {
        [Key]
        public int cntID { get; set; }
        public Nullable<int> CompanyID { get; set; }
        public string cntScreen { get; set; }
        public Nullable<int> cntSeq { get; set; }
        public string LineText { get; set; }
        public Nullable<bool> Bold { get; set; }
        public Nullable<bool> UnderLn { get; set; }
        public Nullable<bool> Italic { get; set; }
        public string FontSize { get; set; }
        public string FontColor { get; set; }
        public string Link { get; set; }
        public Nullable<System.DateTime> StartDate { get; set; }
        public Nullable<System.DateTime> EndDate { get; set; }
        public string CreatedUser { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
    }
}
