using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class VwGetRegistratedPlayers
    {
        public DateTime? SccreatedDate { get; set; }
        public decimal? ScartAmount { get; set; }
        public decimal? Scfee { get; set; }
        public string Name { get; set; }
        public string DivDesc { get; set; }
        public string DraftVenue { get; set; }
        public DateTime? DraftDate { get; set; }
        public string DraftTime { get; set; }
        public string TxnId { get; set; }
    }
}
