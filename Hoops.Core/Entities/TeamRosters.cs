using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class TeamRosters
    {
        public int Id { get; set; }
        public int? TeamId { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public DateTime? Birthdate { get; set; }
        public string Grade { get; set; }
        public DateTime? UpdateDate { get; set; }
        public string UpdateUser { get; set; }
    }
}
