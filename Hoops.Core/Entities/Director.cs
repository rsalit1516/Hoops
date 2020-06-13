using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class Director
    {
        public int DirectorId { get; set; }
        public int? CompanyId { get; set; }
        public int? PersonId { get; set; }
        public int? Seq { get; set; }
        public string Title { get; set; }
        public byte[] Photo { get; set; }
        public string PhonePref { get; set; }
        public int? EmailPref { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }
    }
}
