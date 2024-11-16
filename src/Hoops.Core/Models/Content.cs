using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Hoops.Core.Models
{
    public partial class Content
    {
        [Key]
        public int cntID { get; set; }
        public int? CompanyID { get; set; }
        public string cntScreen { get; set; }
        public int? cntSeq { get; set; }
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
