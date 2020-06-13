using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class VwCoach
    {
        public int CompanyId { get; set; }
        public int? SeasonId { get; set; }
        public int CoachId { get; set; }
        public string Name { get; set; }
        public string Housephone { get; set; }
        public string Cellphone { get; set; }
        public string ShirtSize { get; set; }
        public int? PersonId { get; set; }
        public string Address1 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string CoachPhone { get; set; }
    }
}
