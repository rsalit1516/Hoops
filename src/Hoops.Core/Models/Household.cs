using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Hoops.Core.Models
{
    public partial class Household
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("HouseID")]
        public int HouseId { get; set; }
        [Column("CompanyID")]
        public int? CompanyId { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string Email { get; set; }
        public bool? EmailList { get; set; }
        public string SportsCard { get; set; }
        public int? Guardian { get; set; }
        public bool? FeeWaived { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }
        [Column("TEMID")]
        public int? TeamId { get; set; }
    }
}
