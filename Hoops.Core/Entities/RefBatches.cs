using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class RefBatches
    {
        public int RefBatchId { get; set; }
        public int? CompanyId { get; set; }
        public int SeasonId { get; set; }
        public string CreatedUser { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
