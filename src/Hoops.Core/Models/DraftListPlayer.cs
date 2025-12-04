using System;

namespace Hoops.Core.Models
{
    /// <summary>
    /// DTO for draft list player data
    /// </summary>
    public class DraftListPlayer
    {
        public string Division { get; set; } = string.Empty;
        public string? DraftId { get; set; }
        public string LastName { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public DateTime? DOB { get; set; }
        public int? Grade { get; set; }
        public string? Address1 { get; set; }
        public string? City { get; set; }
        public string? Zip { get; set; }
    }
}
