namespace Hoops.Core.ViewModels
{
    public class SponsorProfileListItemDto
    {
        public int SponsorProfileId { get; set; }
        public string SpoName { get; set; } = string.Empty;
        public string ContactName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public int? LastSeasonId { get; set; }
        public string LastSeasonDescription { get; set; }
    }
}
