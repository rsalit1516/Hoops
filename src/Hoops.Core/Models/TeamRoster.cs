using System;

namespace Hoops.Core.Models
{
    public partial class TeamRoster
    {
        public int ID { get; set; }
        public int? TeamID { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public DateTime? Birthdate { get; set; }
        public string Grade { get; set; }
        public DateTime? UpdateDate { get; set; }
        public string UpdateUser { get; set; }
    }
}
