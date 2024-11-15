using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Hoops.Core.Models
{
    public partial class Comment
    {
        [Key]
        public int CommentID { get; set; }
        public Nullable<int> CompanyID { get; set; }
        public string CommentType { get; set; }
        public Nullable<int> LinkID { get; set; }
        public Nullable<int> UserID { get; set; }
        public string Comment1 { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public string CreatedUSer { get; set; }
    }
}
