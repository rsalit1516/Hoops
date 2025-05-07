using System;
using System.ComponentModel.DataAnnotations;

namespace Hoops.Core.Models
{
    public partial class VwDivision
    {
        [Key]
        public int DivisionId { get; set; }
        public int CompanyId { get; set; }
        public Object SeasonId { get; set; }
        public string DivDesc { get; set; }
        public Object Teams { get; set; }
        public string Gender { get; set; }
        public Object MinDate { get; set; }
        public Object MaxDate { get; set; }
        public string Gender2 { get; set; }
        public Object MinDate2 { get; set; }
        public Object MaxDate2 { get; set; }
        public Object AD { get; set; }
        public string HousePhone { get; set; }
        public string Cellphone { get; set; }
        public string DraftVenue { get; set; }
        public Object DraftDate { get; set; }
        public string DraftTime { get; set; }
        public Object DirectorId { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
    }
}
