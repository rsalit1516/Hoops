using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class Comments
    {
        public int CommentId { get; set; }
        public int? CompanyId { get; set; }
        public string CommentType { get; set; }
        public int? LinkId { get; set; }
        public int? UserId { get; set; }
        public string Comment { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }
    }
}
