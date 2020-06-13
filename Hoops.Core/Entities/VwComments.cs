using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class VwComments
    {
        public int CompanyId { get; set; }
        public int CommentId { get; set; }
        public string CommentType { get; set; }
        public int? LinkId { get; set; }
        public string Comment { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }
    }
}
