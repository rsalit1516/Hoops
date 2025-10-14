using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Hoops.Core.Models
{
    public partial class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("UserID")]
        public int UserId { get; set; }
        [Column("CompanyID")]
        public int? CompanyId { get; set; }
        public string UserName { get; set; }
        public string Name { get; set; }
        [Column("PWord")]
        public string Pword { get; set; }
        public string PassWord { get; set; }
        public int? UserType { get; set; }
        public int? ValidationCode { get; set; }
        [Column("PeopleID")]
        [JsonPropertyName("peopleId")]
        public int? PersonId { get; set; }
        //[ForeignKey("HouseID")]
        [Column("HouseID")]
        public int HouseId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }

        //public virtual Household Household { get; set; }
    }
}
