using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class PayErrorLog
    {
        public int? SeasonId { get; set; }
        public int? CompanyId { get; set; }
        public int? HouseId { get; set; }
        public string ErrorMsg { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
