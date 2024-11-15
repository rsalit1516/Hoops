using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace Hoops.Core.Models
{
    public partial class RefBatch
    {
        [Key]
        public int RefBatchID { get; set; }
        public Nullable<int> CompanyID { get; set; }
        public int SeasonID { get; set; }
        public string CreatedUser { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
    }
}
