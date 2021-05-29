using System;
using System.Collections.Generic;

namespace Hoops.Core.Models
{
    public partial class vw_GetContent
    {
        public Nullable<int> cntSeq { get; set; }
        public string LineText { get; set; }
        public Nullable<bool> Bold { get; set; }
        public Nullable<bool> UnderLN { get; set; }
        public Nullable<bool> Italic { get; set; }
        public string FontSize { get; set; }
        public string FontColor { get; set; }
        public string Link { get; set; }
        public string cntScreen { get; set; }
        public int CompanyID { get; set; }
        public Nullable<System.DateTime> StartDate { get; set; }
        public Nullable<System.DateTime> EndDate { get; set; }
    }
}
