using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class Coach: CommonFields
    {
        public int CoachId { get; set; }
        public int? CompanyId { get; set; }
        public int? SeasonId { get; set; }
        public int? PersonId { get; set; }
        public int? PlayerId { get; set; }
        public string ShirtSize { get; set; }
        public string CoachPhone { get; set; }
        //public DateTime? CreatedDate { get; set; }
        //public string CreatedUser { get; set; }
        public virtual Person Person { get; set; }
    }
}
