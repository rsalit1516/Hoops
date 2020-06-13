using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class VwDivision
    {
        public int DivisionId { get; set; }
        public int CompanyId { get; set; }
        public int? SeasonId { get; set; }
        public string DivDesc { get; set; }
        public int? Teams { get; set; }
        public string Gender { get; set; }
        public DateTime? MinDate { get; set; }
        public DateTime? MaxDate { get; set; }
        public string Gender2 { get; set; }
        public DateTime? MinDate2 { get; set; }
        public DateTime? MaxDate2 { get; set; }
        public bool? Ad { get; set; }
        public string HousePhone { get; set; }
        public string Cellphone { get; set; }
        public string DraftVenue { get; set; }
        public DateTime? DraftDate { get; set; }
        public string DraftTime { get; set; }
        public int? DirectorId { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
    }
}
