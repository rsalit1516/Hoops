using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Hoops.Core.Models
{
    public partial class VwDirector
    {
        [Key]
        public int DirectorId { get; set; }
        public int PersonId { get; set; }
        public string Title { get; set; }
        public string Name { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public int? Seq { get; set; }
        public string PhoneSelected { get; set; }
        public string CellPhone { get; set; }
        public string WorkPhone { get; set; }
        public string Email { get; set; }
        public string Address1 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string PhonePref { get; set; }
        public int? EmailPref { get; set; }
        public int CompanyId { get; set; }
    }
}
