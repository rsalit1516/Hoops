using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hoops.Core.Models
{
    /// <summary>
    /// Represents a scheduled game between two teams
    /// </summary>
    [Table("ScheduleGames")]
    public partial class ScheduleGame
    {
        /// <summary>
        /// Gets or sets the unique identifier for the scheduled game
        /// </summary>
        [Key]
        [Column("ScheduleGamesID")]
        public int ScheduleGamesId { get; set; }

        /// <summary>
        /// Gets or sets the schedule number
        /// </summary>
        public int ScheduleNumber { get; set; }

        /// <summary>
        /// Gets or sets the game number within the schedule
        /// </summary>
        public int GameNumber { get; set; }

        /// <summary>
        /// Gets or sets the location number for the game
        /// </summary>
        public int? LocationNumber { get; set; }

        /// <summary>
        /// Gets or sets the date of the game
        /// </summary>
        [Display(Name = "Game Date")]
        [DataType(DataType.Date)]
        public DateTime GameDate { get; set; }

        /// <summary>
        /// Gets or sets the time of the game
        /// </summary>
        [StringLength(10)]
        [Display(Name = "Game Time")]
        public string GameTime { get; set; }

        /// <summary>
        /// Gets or sets the visiting team number (foreign key)
        /// </summary>
        [Display(Name = "Visiting Team")]
        public int? VisitingTeamNumber { get; set; }

        /// <summary>
        /// Gets or sets the home team number (foreign key)
        /// </summary>
        [Display(Name = "Home Team")]
        public int? HomeTeamNumber { get; set; }

        /// <summary>
        /// Gets or sets the visiting team score
        /// </summary>
        [Display(Name = "Visiting Team Score")]
        public int? VisitingTeamScore { get; set; }

        /// <summary>
        /// Gets or sets the home team score
        /// </summary>
        [Display(Name = "Home Team Score")]
        public int? HomeTeamScore { get; set; }

        /// <summary>
        /// Gets or sets whether the visiting team forfeited
        /// </summary>
        [Display(Name = "Visiting Team Forfeited")]
        public bool? VisitingForfeited { get; set; }

        /// <summary>
        /// Gets or sets whether the home team forfeited
        /// </summary>
        [Display(Name = "Home Team Forfeited")]
        public bool? HomeForfeited { get; set; }

        /// <summary>
        /// Gets or sets the season identifier
        /// </summary>
        [Column("SeasonID")]
        public int? SeasonId { get; set; }

        /// <summary>
        /// Gets or sets the division identifier
        /// </summary>
        [Column("DivisionID")]
        public int? DivisionId { get; set; }

        // Navigation properties
        /// <summary>
        /// Gets or sets the visiting team
        /// </summary>
        [ForeignKey(nameof(VisitingTeamNumber))]
        public virtual Team VisitingTeam { get; set; }

        /// <summary>
        /// Gets or sets the home team
        /// </summary>
        [ForeignKey(nameof(HomeTeamNumber))]
        public virtual Team HomeTeam { get; set; }

        /// <summary>
        /// Gets or sets the season this game belongs to
        /// </summary>
        public virtual Season Season { get; set; }

        /// <summary>
        /// Gets or sets the division this game belongs to
        /// </summary>
        public virtual Division Division { get; set; }

        /// <summary>
        /// Gets or sets the location where the game is played
        /// </summary>
        public virtual Location Location { get; set; }

        // Helper methods
        /// <summary>
        /// Determines if the game has been completed (has final scores)
        /// </summary>
        /// <returns>True if both teams have scores recorded</returns>
        public bool IsGameCompleted()
        {
            return VisitingTeamScore.HasValue && HomeTeamScore.HasValue;
        }

        /// <summary>
        /// Gets the winning team number, or null if tied/incomplete
        /// </summary>
        /// <returns>The winning team number or null</returns>
        public int? GetWinningTeamNumber()
        {
            if (!IsGameCompleted())
                return null;

            if (VisitingTeamScore > HomeTeamScore)
                return VisitingTeamNumber;
            else if (HomeTeamScore > VisitingTeamScore)
                return HomeTeamNumber;

            return null; // Tie game
        }

        /// <summary>
        /// Gets the game result as a formatted string
        /// </summary>
        /// <returns>Game result string</returns>
        public string GetGameResult()
        {
            if (!IsGameCompleted())
                return "Game not completed";

            if (VisitingForfeited == true)
                return "Visiting team forfeited";
            if (HomeForfeited == true)
                return "Home team forfeited";

            return $"Final Score: Visiting {VisitingTeamScore} - Home {HomeTeamScore}";
        }

        /// <summary>
        /// Gets the formatted game display string
        /// </summary>
        /// <returns>Game display string</returns>
        public string GetDisplayName()
        {
            return $"Game {GameNumber}: {GameDate:MM/dd/yyyy} at {GameTime}";
        }

        /// <summary>
        /// Determines if either team forfeited the game
        /// </summary>
        /// <returns>True if either team forfeited</returns>
        public bool IsGameForfeited()
        {
            return VisitingForfeited == true || HomeForfeited == true;
        }

        /// <summary>
        /// Gets the game status
        /// </summary>
        /// <returns>Game status string</returns>
        public string GetGameStatus()
        {
            if (IsGameForfeited())
                return "Forfeited";
            if (IsGameCompleted())
                return "Completed";
            if (GameDate < DateTime.Now)
                return "In Progress";
            return "Scheduled";
        }
    }
}
