using System;
using System.Collections.Generic;

namespace Hoops.Core.Models
{
    public partial class TeamRoster
    {
        public int ID { get; set; }
        public Nullable<int> TeamID { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public Nullable<System.DateTime> Birthdate { get; set; }
        public string Grade { get; set; }
        public Nullable<System.DateTime> UpdateDate { get; set; }
        public string UpdateUser { get; set; }
    }
}
