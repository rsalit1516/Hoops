using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class Sponsor
    {
        public int SponsorId { get; set; }
        public int? CompanyId { get; set; }
        public int? SeasonId { get; set; }
        public int? HouseId { get; set; }
        public string ContactNameDelete { get; set; }
        public string SpoNameDelete { get; set; }
        public string ShirtName { get; set; }
        public string Emaildelete { get; set; }
        public string Urldelete { get; set; }
        public string AddressDelete { get; set; }
        public string CityDelete { get; set; }
        public string StateDelete { get; set; }
        public string ZipDelete { get; set; }
        public string PhoneDelete { get; set; }
        public string ShirtSize { get; set; }
        public decimal? SpoAmount { get; set; }
        public string TypeOfBussDelete { get; set; }
        public string Color1 { get; set; }
        public int Color1Id { get; set; }
        public string Color2 { get; set; }
        public int Color2Id { get; set; }
        public int? ShoppingCartId { get; set; }
        public bool? MailCheck { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }
        public int? SponsorProfileId { get; set; }
        public decimal? FeeId { get; set; }
        public bool? ShowAd { get; set; }
        public DateTime? AdExpiration { get; set; }
    }
}
