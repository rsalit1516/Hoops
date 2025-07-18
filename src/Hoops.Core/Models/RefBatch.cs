using System;
using System.ComponentModel.DataAnnotations;


namespace Hoops.Core.Models
{
    public partial class RefBatch
    {
        [Key]
        public int RefBatchID { get; set; }
        public int? CompanyID { get; set; }
        public int SeasonID { get; set; }
        public string CreatedUser { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
