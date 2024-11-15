using System;
using System.Collections.Generic;

namespace Hoops.Core.Models
{
    public partial class vw_Content
    {
        public int CompanyID { get; set; }
        public int CntID { get; set; }
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
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public string CreatedUser { get; set; }
    }
}
