using System;
#nullable enable
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Hoops.Core.Interface;

namespace Hoops.Core.Models
{
    /// <summary>
    /// Represents a team within a division, including coaches, players, and draft information
    /// </summary>
    [Table("Teams")]
    public partial class Team : IAuditable
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

        [NotMapped]
        [Display(Name = "Team Color")]
        public string? TeamColor { get; set; }

        [Column("TeamColorID")]
        [Display(Name = "Team Color")]
        public int? TeamColorId { get; set; }

        [StringLength(4)]
        [Display(Name = "Team Number")]
        public string? TeamNumber { get; set; }

        [Display(Name = "Created By")]
        public int? CreatedUser { get; set; }

        [Display(Name = "Created Date")]
        public DateTime? CreatedDate { get; set; }

        [Display(Name = "Modified Date")]
        public DateTime? ModifiedDate { get; set; }

        [Display(Name = "Modified By")]
        public int? ModifiedUser { get; set; }

        // Navigation properties (nullable)
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
            var num = TeamNumber?.Trim();
            var color = TeamColor?.Trim();
            var name = TeamName?.Trim();

            if (!string.IsNullOrEmpty(num) && !string.IsNullOrEmpty(color) && !string.IsNullOrEmpty(name))
                return $"{num}-{color} {name}";
            if (!string.IsNullOrEmpty(num) && !string.IsNullOrEmpty(color))
                return $"{num}-{color}";
            if (!string.IsNullOrEmpty(num) && !string.IsNullOrEmpty(name))
                return $"{num} {name}";
            if (!string.IsNullOrEmpty(name) && !string.IsNullOrEmpty(color))
                return $"{name} ({color})";
            if (!string.IsNullOrEmpty(num))
                return $"#{num}";
            if (!string.IsNullOrEmpty(name))
                return name;
            if (!string.IsNullOrEmpty(color))
                return color;
            return $"Team {TeamId}";
        }

        public string GetTeamIdentifier()
        {
            if (!string.IsNullOrEmpty(TeamNumber))
            {
                return $"#{TeamNumber} {TeamName}";
            }
            return TeamName ?? "Unknown Team";
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
