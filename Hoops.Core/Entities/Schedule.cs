using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class Schedule
    {
        public int ScheduleNumber { get; set; }
        public int LeagueNumber { get; set; }
        public string ScheduleName { get; set; }
        public bool Computed { get; set; }
        public DateTime? ComputedEndDate { get; set; }
        public bool HomeFields { get; set; }
        public DateTime? ParameterStartDate { get; set; }
        public short LengthOfGame { get; set; }
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
        public string Comments { get; set; }
    }
}
