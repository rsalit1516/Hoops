using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class VwGetHousePlayers
    {
        public int PersonId { get; set; }
        public string Name { get; set; }
        public string DivDesc { get; set; }
        public string Status { get; set; }
        public bool? Player { get; set; }
        public int? Mainhouseid { get; set; }
        public int CompanyId { get; set; }
        public int? SeasonId { get; set; }
    }
}
