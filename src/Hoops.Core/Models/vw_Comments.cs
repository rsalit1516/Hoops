using System;
using System.Collections.Generic;

namespace Hoops.Core.Models
{
    public partial class vw_Comments
    {
        public int CompanyID { get; set; }
        public int CommentID { get; set; }
        public string CommentType { get; set; }
        public Nullable<int> LinkID { get; set; }
        public string Comment { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public string CreatedUser { get; set; }
    }
}
