using System;
#nullable enable
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hoops.Core.Models
{
    /// <summary>
    /// Represents a team within a division, including coaches, players, and draft information
    /// </summary>
    [Table("Teams")]
    public partial class Team
    {
        public Team()
        {
            Players = new HashSet<Player>();
            HomeGames = new HashSet<ScheduleGame>();
            VisitingGames = new HashSet<ScheduleGame>();
        }

        [Key]
        [Column("TeamID")]
        public int TeamId { get; set; }

        [Column("DivisionID")]
        [Display(Name = "Division")]
        public int DivisionId { get; set; }

        [Column("SeasonID")]
        [Display(Name = "Season")]
        public int? SeasonId { get; set; }

        [Column("CoachID")]
        [Display(Name = "Head Coach")]
        public int? CoachId { get; set; }

        [Column("AssCoachID")]
        [Display(Name = "Assistant Coach")]
        public int? AssCoachId { get; set; }

        [Column("SponsorID")]
        [Display(Name = "Sponsor")]
        public int? SponsorId { get; set; }

        [StringLength(50)]
        [Display(Name = "Team Name")]
        public string? TeamName { get; set; }

        [StringLength(50)]
        [Display(Name = "Team Color")]
        public string? TeamColor { get; set; }

        [Column("TeamColorID")]
        [Display(Name = "Team Color")]
        public int TeamColorId { get; set; }

        [StringLength(4)]
        [Display(Name = "Team Number")]
        public string? TeamNumber { get; set; }

        [StringLength(50)]
        [Display(Name = "Created By")]
        public string? CreatedUser { get; set; }

        [Display(Name = "Created Date")]
        public DateTime? CreatedDate { get; set; }

        // Draft pick properties (nullable)
        public int? Round1 { get; set; }
        public int? Round2 { get; set; }
        public int? Round3 { get; set; }
        public int? Round4 { get; set; }
        public int? Round5 { get; set; }
        public int? Round6 { get; set; }
        public int? Round7 { get; set; }
        public int? Round8 { get; set; }

        // Navigation properties (nullable)
        public virtual Season? Season { get; set; }
        public virtual Division? Division { get; set; }
        public virtual Coach? Coach { get; set; }
        public virtual Coach? AssistantCoach { get; set; }
        public virtual Sponsor? Sponsor { get; set; }
        public virtual Color? Color { get; set; }

        public virtual ICollection<Player> Players { get; set; }
        public virtual ICollection<ScheduleGame> HomeGames { get; set; }
        public virtual ICollection<ScheduleGame> VisitingGames { get; set; }

        // Helper methods
        public string GetDisplayName()
        {
            if (!string.IsNullOrEmpty(TeamColor))
            {
                return $"{TeamName} ({TeamColor})";
            }
            return TeamName ?? "Unknown Team";
        }

        public string GetTeamIdentifier()
        {
            if (!string.IsNullOrEmpty(TeamNumber))
            {
                return $"#{TeamNumber} {TeamName}";
            }
            return TeamName ?? "Unknown Team";
        }

        public List<int> GetDraftPicks()
        {
            var picks = new List<int>();
            if (Round1.HasValue) picks.Add(Round1.Value);
            if (Round2.HasValue) picks.Add(Round2.Value);
            if (Round3.HasValue) picks.Add(Round3.Value);
            if (Round4.HasValue) picks.Add(Round4.Value);
            if (Round5.HasValue) picks.Add(Round5.Value);
            if (Round6.HasValue) picks.Add(Round6.Value);
            if (Round7.HasValue) picks.Add(Round7.Value);
            if (Round8.HasValue) picks.Add(Round8.Value);
            return picks;
        }

        public string GetDraftPicksString()
        {
            var picks = GetDraftPicks();
            return picks.Count > 0 ? string.Join(", ", picks) : "No picks";
        }

        public bool HasCompleteCoachingStaff()
        {
            return CoachId.HasValue && AssCoachId.HasValue;
        }

        public string GetCoachingStaffSummary()
        {
            var coaches = new List<string>();
            if (Coach != null)
            {
                coaches.Add($"Head: {Coach.ToString()}");
            }
            if (AssistantCoach != null)
            {
                coaches.Add($"Asst: {AssistantCoach.ToString()}");
            }
            return coaches.Count > 0 ? string.Join(" | ", coaches) : "No coaches assigned";
        }

        public int GetTotalGameCount()
        {
            return (HomeGames?.Count ?? 0) + (VisitingGames?.Count ?? 0);
        }

        public int GetHomeGameCount()
        {
            return HomeGames?.Count ?? 0;
        }

        public int GetAwayGameCount()
        {
            return VisitingGames?.Count ?? 0;
        }
    }
}
