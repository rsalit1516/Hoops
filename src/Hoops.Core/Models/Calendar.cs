using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Hoops.Core.Models
{
    public partial class Calendar
    {
        [Key]
        public int ID { get; set; }
        public int? CompanyID { get; set; }
        public DateTime? dDate { get; set; }
        public int? iYear { get; set; }
        public int? iMonth { get; set; }
        public int? iDay { get; set; }
        public string sTitle { get; set; }
        public string sSubTitle { get; set; }
        public string sDesc1 { get; set; }
        public string sDesc2 { get; set; }
        public string sDesc3 { get; set; }
        public byte? Display { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }
    }
}
