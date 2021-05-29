using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hoops.Core.Models
{
    public partial class ScheduleDivision
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int ScheduleNumber { get; set; }
        public Nullable<int> LeagueNumber { get; set; }
        public string ScheduleName { get; set; }
        public Nullable<short> Computed { get; set; }
        public Nullable<System.DateTime> ComputedEndDate { get; set; }
        public Nullable<short> HomeFields { get; set; }
        public Nullable<System.DateTime> ParameterStartDate { get; set; }
        public Nullable<int> LenghtOfGames { get; set; }
        public string ContactFirstName { get; set; }
        public string ContactLastName { get; set; }
        public string WorkPhone { get; set; }
        public string HomePhone { get; set; }
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
