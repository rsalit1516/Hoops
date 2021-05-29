using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Hoops.Core.Models
{
    public partial class Calendar
    {
        [Key]
        public int ID { get; set; }
        public Nullable<int> CompanyID { get; set; }
        public Nullable<System.DateTime> dDate { get; set; }
        public Nullable<int> iYear { get; set; }
        public Nullable<int> iMonth { get; set; }
        public Nullable<int> iDay { get; set; }
        public string sTitle { get; set; }
        public string sSubTitle { get; set; }
        public string sDesc1 { get; set; }
        public string sDesc2 { get; set; }
        public string sDesc3 { get; set; }
        public Nullable<byte> Display { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public string CreatedUser { get; set; }
    }
}
