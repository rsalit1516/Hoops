using System;

namespace Hoops.Functions.Models
{
    // Lightweight DTO to avoid navigation property cycles when serializing Teams
    public class TeamDto
    {
        public int TeamId { get; set; }
        public int DivisionId { get; set; }
        public int? SeasonId { get; set; }
        public int TeamColorId { get; set; }
        public string? TeamName { get; set; }
        public string? Name { get; set; } // alias for TeamName to satisfy some UI usages
        public string? TeamNumber { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? CreatedUser { get; set; }
    }
}
