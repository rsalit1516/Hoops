using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hoops.Core.Models
{
    [Table("Comments")]
    public partial class Comment
    {
        [Key]
        public int CommentID { get; set; }
        public int? CompanyID { get; set; }
        public string CommentType { get; set; }
        public int? LinkID { get; set; }
        public int? UserID { get; set; }
        [Column("Comment")]
        public string Comment1 { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUSer { get; set; }
    }
}
