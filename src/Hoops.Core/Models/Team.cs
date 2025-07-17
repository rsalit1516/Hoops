using System;
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
        /// <summary>
        /// Initializes a new instance of the Team class
        /// </summary>
        public Team()
        {
            Players = new HashSet<Player>();
            HomeGames = new HashSet<ScheduleGame>();
            VisitingGames = new HashSet<ScheduleGame>();
            // ScheduleDivTeams = new HashSet<ScheduleDivTeam>();
        }

        /// <summary>
        /// Gets or sets the unique identifier for the team
        /// </summary>
        [Key]
        [Column("TeamID")]
        public int TeamId { get; set; }

        /// <summary>
        /// Gets or sets the division identifier this team belongs to
        /// </summary>
        [Required]
        [Column("DivisionID")]
        [Display(Name = "Division")]
        public int DivisionId { get; set; }

        /// <summary>
        /// Gets or sets the season identifier this team belongs to
        /// </summary>
        [Column("SeasonID")]
        [Display(Name = "Season")]
        public int? SeasonId { get; set; }

        /// <summary>
        /// Gets or sets the head coach identifier for this team
        /// </summary>
        [Column("CoachID")]
        [Display(Name = "Head Coach")]
        public int? CoachId { get; set; }

        /// <summary>
        /// Gets or sets the assistant coach identifier for this team
        /// </summary>
        [Column("AssCoachID")]
        [Display(Name = "Assistant Coach")]
        public int? AssCoachId { get; set; }

        /// <summary>
        /// Gets or sets the sponsor identifier for this team
        /// </summary>
        [Column("SponsorID")]
        [Display(Name = "Sponsor")]
        public int? SponsorId { get; set; }

        /// <summary>
        /// Gets or sets the team name
        /// </summary>
        [Required]
        [StringLength(50)]
        [Display(Name = "Team Name")]
        public string TeamName { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the team color name
        /// </summary>
        [StringLength(50)]
        [Display(Name = "Team Color")]
        public string TeamColor { get; set; }

        /// <summary>
        /// Gets or sets the team color identifier
        /// </summary>
        [Column("TeamColorID")]
        [Display(Name = "Team Color")]
        public int TeamColorId { get; set; }

        /// <summary>
        /// Gets or sets the team number (used for identification)
        /// </summary>
        [StringLength(4)]
        [Display(Name = "Team Number")]
        public string TeamNumber { get; set; }

        /// <summary>
        /// Gets or sets the draft round 1 pick
        /// </summary>
        [Display(Name = "Round 1 Pick")]
        public int? Round1 { get; set; }

        /// <summary>
        /// Gets or sets the draft round 2 pick
        /// </summary>
        [Display(Name = "Round 2 Pick")]
        public int? Round2 { get; set; }

        /// <summary>
        /// Gets or sets the draft round 3 pick
        /// </summary>
        [Display(Name = "Round 3 Pick")]
        public int? Round3 { get; set; }

        /// <summary>
        /// Gets or sets the draft round 4 pick
        /// </summary>
        [Display(Name = "Round 4 Pick")]
        public int? Round4 { get; set; }

        /// <summary>
        /// Gets or sets the draft round 5 pick
        /// </summary>
        [Display(Name = "Round 5 Pick")]
        public int? Round5 { get; set; }

        /// <summary>
        /// Gets or sets the draft round 6 pick
        /// </summary>
        [Display(Name = "Round 6 Pick")]
        public int? Round6 { get; set; }

        /// <summary>
        /// Gets or sets the draft round 7 pick
        /// </summary>
        [Display(Name = "Round 7 Pick")]
        public int? Round7 { get; set; }

        /// <summary>
        /// Gets or sets the draft round 8 pick
        /// </summary>
        [Display(Name = "Round 8 Pick")]
        public int? Round8 { get; set; }

        /// <summary>
        /// Gets or sets the date and time when the team was created
        /// </summary>
        [Display(Name = "Created Date")]
        public DateTime? CreatedDate { get; set; }

        /// <summary>
        /// Gets or sets the user who created the team record
        /// </summary>
        [StringLength(50)]
        [Display(Name = "Created By")]
        public string CreatedUser { get; set; }

        // Navigation properties
        /// <summary>
        /// Gets or sets the season this team belongs to
        /// </summary>
        public virtual Season Season { get; set; }

        /// <summary>
        /// Gets or sets the division this team belongs to
        /// </summary>
        public virtual Division Division { get; set; }

        /// <summary>
        /// Gets or sets the head coach of this team
        /// </summary>
        public virtual Coach Coach { get; set; }

        /// <summary>
        /// Gets or sets the assistant coach of this team
        /// </summary>
        public virtual Coach AssistantCoach { get; set; }

        /// <summary>
        /// Gets or sets the sponsor of this team
        /// </summary>
        public virtual Sponsor Sponsor { get; set; }

        /// <summary>
        /// Gets or sets the team color information
        /// </summary>
        public virtual Color Color { get; set; }

        /// <summary>
        /// Gets or sets the collection of players on this team
        /// </summary>
        public virtual ICollection<Player> Players { get; set; }

        /// <summary>
        /// Gets or sets the collection of games where this team plays at home
        /// </summary>
        public virtual ICollection<ScheduleGame> HomeGames { get; set; }

        /// <summary>
        /// Gets or sets the collection of games where this team plays as visiting team
        /// </summary>
        public virtual ICollection<ScheduleGame> VisitingGames { get; set; }

        /// <summary>
        /// Gets or sets the collection of schedule division teams for this team
        /// </summary>
        // Temporarily disabled to prevent EF auto-configuration issues
        // public virtual ICollection<ScheduleDivTeam> ScheduleDivTeams { get; set; }

        // Helper methods
        /// <summary>
        /// Gets the full display name combining team name and color
        /// </summary>
        /// <returns>Formatted team display name</returns>
        public string GetDisplayName()
        {
            if (!string.IsNullOrEmpty(TeamColor))
            {
                return $"{TeamName} ({TeamColor})";
            }
            return TeamName ?? "Unknown Team";
        }

        /// <summary>
        /// Gets the team identifier combining team number and name
        /// </summary>
        /// <returns>Team identifier string</returns>
        public string GetTeamIdentifier()
        {
            if (!string.IsNullOrEmpty(TeamNumber))
            {
                return $"#{TeamNumber} {TeamName}";
            }
            return TeamName ?? "Unknown Team";
        }

        /// <summary>
        /// Gets all draft picks for this team in order
        /// </summary>
        /// <returns>List of draft picks</returns>
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

        /// <summary>
        /// Gets formatted draft picks string
        /// </summary>
        /// <returns>Comma-separated list of draft picks</returns>
        public string GetDraftPicksString()
        {
            var picks = GetDraftPicks();
            return picks.Count > 0 ? string.Join(", ", picks) : "No picks";
        }

        /// <summary>
        /// Determines if the team has a complete coaching staff
        /// </summary>
        /// <returns>True if both head coach and assistant coach are assigned</returns>
        public bool HasCompleteCoachingStaff()
        {
            return CoachId.HasValue && AssCoachId.HasValue;
        }

        /// <summary>
        /// Gets the coaching staff summary
        /// </summary>
        /// <returns>Formatted coaching staff information</returns>
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

        /// <summary>
        /// Gets the total number of games for this team
        /// </summary>
        /// <returns>Total game count</returns>
        public int GetTotalGameCount()
        {
            return (HomeGames?.Count ?? 0) + (VisitingGames?.Count ?? 0);
        }

        /// <summary>
        /// Gets the team's home game count
        /// </summary>
        /// <returns>Home game count</returns>
        public int GetHomeGameCount()
        {
            return HomeGames?.Count ?? 0;
        }

        /// <summary>
        /// Gets the team's away game count
        /// </summary>
        /// <returns>Away game count</returns>
        public int GetAwayGameCount()
        {
            return VisitingGames?.Count ?? 0;
        }
    }
}
