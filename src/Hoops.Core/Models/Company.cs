using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Hoops.Core.Interface;

namespace Hoops.Core.Models
{
    [Table("Companies")]
    public partial class Company : IAuditable
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("CompanyID")]
        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public int TimeZone { get; set; }
        public string ImageName { get; set; }
        public string EmailSender { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? CreatedUser { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? ModifiedUser { get; set; }
    }
}
