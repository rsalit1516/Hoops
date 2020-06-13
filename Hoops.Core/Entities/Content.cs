using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class Content
    {
        public int CntId { get; set; }
        public int? CompanyId { get; set; }
        public string CntScreen { get; set; }
        public int? CntSeq { get; set; }
        public string LineText { get; set; }
        public bool? Bold { get; set; }
        public bool? UnderLn { get; set; }
        public bool? Italic { get; set; }
        public string FontSize { get; set; }
        public string FontColor { get; set; }
        public string Link { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string CreatedUser { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
