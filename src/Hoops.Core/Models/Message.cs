using System;
using System.ComponentModel.DataAnnotations;

namespace Hoops.Core.Models
{
    public partial class Message
    {
        [Key]
        public int MessID { get; set; }
        public int? CompanyID { get; set; }
        public string MessScreen { get; set; }
        public int? MessSeq { get; set; }
        public string MessageText { get; set; }
        public string LineText { get; set; }
        public bool? Bold { get; set; }
        public bool? UnderLn { get; set; }
        public bool? Italic { get; set; }
        public string FontSize { get; set; }
        public string FontColor { get; set; }
        public string MessageLink { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string CreatedUser { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
