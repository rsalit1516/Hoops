using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hoops.Core.Models
{
    public partial class SponsorProfile
    {
        [Key] //declaring key even though it doesn't exist in DB - it should!
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("SponsorProfileID")]
        public int SponsorProfileId { get; set; }
        [Column("CompanyID")]
        public int CompanyId { get; set; }
        [Column("HouseID")]
        public Nullable<int> HouseId { get; set; }
        public string ContactName { get; set; }
        public string SpoName { get; set; }
        [Column("EMAIL")]
        public string Email { get; set; }
        [Column("URL")]
        public string Url { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string Phone { get; set; }
        public string TypeOfBuss { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public string CreatedUser { get; set; }
        public bool? ShowAd { get; set; }
        public DateTime? AdExpiration { get; set; }

       
        public virtual ICollection<Sponsor> Sponsors { get; set; }
    }
}
