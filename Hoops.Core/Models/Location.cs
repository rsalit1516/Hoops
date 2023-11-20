using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Hoops.Core.Models
{
    [Table("Location")]
    public partial class Location
    {
        public int LocationNumber { get; set; }
        public string LocationName { get; set; }
        public string Notes { get; set; }
        public int? Id { get; set; }
        
    }
}
