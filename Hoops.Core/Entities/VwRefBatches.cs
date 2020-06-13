using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class VwRefBatches
    {
        public int CompanyId { get; set; }
        public int RefBatchId { get; set; }
        public int SeasonId { get; set; }
        public string Season { get; set; }
        public string CreatedDate { get; set; }
        public string CreatedUser { get; set; }
    }
}
