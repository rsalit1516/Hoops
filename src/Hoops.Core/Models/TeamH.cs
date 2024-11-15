using System;
using System.Collections.Generic;

namespace Hoops.Core.Models
{
    public partial class TeamH
    {
        public Nullable<int> TeamNumber { get; set; }
        public string TeamName { get; set; }
        public string ContactFirstName { get; set; }
        public string ContactLastName { get; set; }
        public string WorkPhone { get; set; }
        public string HomePhone { get; set; }
        public string CellPhone { get; set; }
        public string FaxNumber { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string Email { get; set; }
        public string Notes { get; set; }
    }
}
