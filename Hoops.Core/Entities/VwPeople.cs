using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class VwPeople
    {
        public int CompanyId { get; set; }
        public int PersonId { get; set; }
        public int? HouseId { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string WorkPhone { get; set; }
        public string CellPhone { get; set; }
        public string HousePhone { get; set; }
        public string Email { get; set; }
        public bool? Suspended { get; set; }
        public string LatestSeason { get; set; }
        public string LatestShirtSize { get; set; }
        public DateTime? BirthDate { get; set; }
        public bool? Bc { get; set; }
        public string Gender { get; set; }
        public string SchoolName { get; set; }
        public int? Grade { get; set; }
        public int? GiftedLevelsUp { get; set; }
        public bool? FeeWaived { get; set; }
        public bool? Player { get; set; }
        public bool? Parent { get; set; }
        public bool? Coach { get; set; }
        public bool? AsstCoach { get; set; }
        public bool? BoardOfficer { get; set; }
        public bool? BoardMember { get; set; }
        public bool? Ad { get; set; }
        public bool? Sponsor { get; set; }
        public bool? SignUps { get; set; }
        public bool? TryOuts { get; set; }
        public bool? TeeShirts { get; set; }
        public bool? Printing { get; set; }
        public bool? Equipment { get; set; }
        public bool? Electrician { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedUser { get; set; }
        public string HouseName { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public int? Guardian { get; set; }
    }
}
