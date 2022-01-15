using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hoops.Core.Models
{
    public partial class Sponsor
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("SponsorID")]
        public int SponsorId { get; set; }
        [Column("CompanyID")]
        public Nullable<int> CompanyId { get; set; }
        [Column("SeasonID")]
        public Nullable<int> SeasonId { get; set; }
        [Column("HouseID")]
        public Nullable<int> HouseId { get; set; }
        //public string ContactNameDELETE { get; set; }
        //public string SpoNameDELETE { get; set; }
        public string ShirtName { get; set; }
        //public string EMAILDELETE { get; set; }
        //public string URLDELETE { get; set; }
        //public string AddressDELETE { get; set; }
        //public string CityDELETE { get; set; }
        //public string StateDELETE { get; set; }
        //public string ZipDELETE { get; set; }
        //public string PhoneDELETE { get; set; }
        public string ShirtSize { get; set; }
        public Nullable<decimal> SpoAmount { get; set; }
        //public string TypeOfBussDELETE { get; set; }
        public string Color1 { get; set; }
        [Column("Color1AD")]
        public int Color1Id { get; set; }
        public string Color2 { get; set; }
        [Column("Color2AD")]
        public int Color2Id { get; set; }
        [Column("ShoppingCartID")]
        public Nullable<int> ShoppingCartId { get; set; }
        public Nullable<bool> MailCheck { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public string CreatedUser { get; set; }
        [Column("SponsorProfileID")]
        public int SponsorProfileId { get; set; }
        [Column("FeeID")]
        public Nullable<decimal> FeeId { get; set; }
        public DateTime? AdExpiration { get; set; }

        [ForeignKey("SponsorProfileID")]
        public virtual SponsorProfile SponsorProfile { get; set; }
    }
}
