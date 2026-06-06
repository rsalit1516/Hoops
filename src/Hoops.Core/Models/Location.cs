using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Hoops.Core.Interface;

namespace Hoops.Core.Models
{
    [Table("ScheduleLocations")]
    public partial class Location : IAuditable
    {
        [Key]
        public int LocationNumber { get; set; }
        public string LocationName { get; set; }
        public string Notes { get; set; }

        public DateTime? CreatedDate { get; set; }
        public int? CreatedUser { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? ModifiedUser { get; set; }
    }
}
