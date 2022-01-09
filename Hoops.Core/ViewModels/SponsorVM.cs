using System;
using System.ComponentModel.DataAnnotations;

namespace Hoops.Core.ViewModels
{
    public partial class SponsorVM
    {
        public int SponsorId { get; set; }
        public string SponsorName {get; set;}
        public string Url { get; set; }
        public DateTime? AdExpiration { get; set; }
    }
}
