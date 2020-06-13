using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class VwBatchPlayers
    {
        public int CompanyId { get; set; }
        public int? RefundBatchId { get; set; }
        public string DraftId { get; set; }
        public int PlayerId { get; set; }
        public int? HouseId { get; set; }
        public int PersonId { get; set; }
        public string PlayerName { get; set; }
        public string Address1 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public decimal? PaidAmount { get; set; }
        public string Online { get; set; }
        public string Phone { get; set; }
        public string Mother { get; set; }
        public string Father { get; set; }
        public string SeaDesc { get; set; }
    }
}
