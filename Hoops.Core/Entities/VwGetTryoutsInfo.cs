using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class VwGetTryoutsInfo
    {
        public string Division { get; set; }
        public string Gender { get; set; }
        public string Birthdates { get; set; }
        public string Location { get; set; }
        public string Tryouts { get; set; }
        public int? SeasonId { get; set; }
        public string Sex { get; set; }
        public DateTime? MinDate { get; set; }
    }
}
