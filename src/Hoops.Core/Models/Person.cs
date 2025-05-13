using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hoops.Core.Models
{
    public partial class Person
    {
        [Key]
        [Column("PeopleID")]
        public int PersonId { get; set; }
        [Column("CompanyID")]
        public int? CompanyId { get; set; }
        [Column("MainHouseID")]
        public int? HouseId { get; set; }
        [MaxLength(50)]
        public string FirstName { get; set; }
        [MaxLength(50)]
        public string LastName { get; set; }
        [MaxLength(25)]
        public string Workphone { get; set; }
        [MaxLength(15)]
        public string Cellphone { get; set; }
        [MaxLength(50)]
        public string Email { get; set; }
        public bool? Suspended { get; set; }
        [MaxLength(15)]
        public string LatestSeason { get; set; }
        [MaxLength(20)]
        public string LatestShirtSize { get; set; }
        public int? LatestRating { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime? BirthDate { get; set; }
        [Column("BC")]
        public bool? Bc { get; set; }
        [MaxLength(1)]
        public string Gender { get; set; }
        [MaxLength(50)]
        public string SchoolName { get; set; }
        public int? Grade { get; set; }
        [Column("GiftedLevelsUP")]
        public int? GiftedLevelsUp { get; set; }
        public bool? FeeWaived { get; set; }
        public bool? Player { get; set; }
        public bool? Parent { get; set; }
        public bool? Coach { get; set; }
        public bool? AsstCoach { get; set; }
        public bool? BoardOfficer { get; set; }
        public bool? BoardMember { get; set; }
        [Column("AD")]
        public bool? Ad { get; set; }
        public bool? Sponsor { get; set; }
        public bool? SignUps { get; set; }
        public bool? TryOuts { get; set; }
        public bool? TeeShirts { get; set; }
        public bool? Printing { get; set; }
        public bool? Equipment { get; set; }
        public bool? Electrician { get; set; }
        [Column(TypeName = "smalldatetime")]
        public DateTime? CreatedDate { get; set; }
        [MaxLength(20)]
        public string CreatedUser { get; set; }
        [Column("TEMPID")]
        public int? TempId { get; set; }

        [ForeignKey("HouseId")]
        public virtual Household Household { get; set; }
        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    }
}
