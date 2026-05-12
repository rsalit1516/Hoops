#nullable enable
using System;

namespace Hoops.Core.Models
{
    public class DraftReportPlayer
    {
        public int PersonId { get; set; }
        public string Division { get; set; } = string.Empty;
        public string? DraftId { get; set; }
        public string LastName { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public DateTime? DOB { get; set; }
        public string? Phone { get; set; }
        public int? Grade { get; set; }
        public int? Rating { get; set; }
        public string? DraftNotes { get; set; }
    }
}
