using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class VwPlayersList
    {
        public int CompanyId { get; set; }
        public int SeasonId { get; set; }
        public int PlayerId { get; set; }
        public string Name { get; set; }
        public string Mother { get; set; }
        public string Father { get; set; }
        public DateTime? BirthDate { get; set; }
        public string Sportscard { get; set; }
        public string Phone { get; set; }
        public string Address1 { get; set; }
        public string City { get; set; }
        public string Zip { get; set; }
        public string Scholarship { get; set; }
        public int? Age { get; set; }
        public int CoachId { get; set; }
        public decimal? BalanceOwed { get; set; }
        public decimal? PaidAmount { get; set; }
        public string TeamNumber { get; set; }
    }
}
