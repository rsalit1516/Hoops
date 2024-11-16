using System;
using System.Collections.Generic;

namespace Hoops.Core.Models
{
    public partial class vw_GetContent
    {
        public int? cntSeq { get; set; }
        public string LineText { get; set; }
        public bool? Bold { get; set; }
        public bool? UnderLN { get; set; }
        public bool? Italic { get; set; }
        public string FontSize { get; set; }
        public string FontColor { get; set; }
        public string Link { get; set; }
        public string cntScreen { get; set; }
        public int CompanyID { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
