using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Hoops.Core.Models
{
    public partial class VwCoach
    {
        [Key]
        public int CoachId { get; set; }
        public int CompanyId { get; set; }
        public Nullable<int> SeasonId { get; set; }
        public string Name { get; set; }
        public string Housephone { get; set; }
        public string Cellphone { get; set; }
        public string ShirtSize { get; set; }
        public Nullable<int> PersonId { get; set; }
        public string Address1 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string CoachPhone { get; set; }
    }
}
