using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hoops.Core.Models
{
    /// <summary>
    /// Represents a division within a season, containing teams and players organized by age and gender
    /// </summary>
    [Table("Divisions")]
    public partial class Division
    {
        /// <summary>
        /// Initializes a new instance of the Division class
        /// </summary>
        public Division()
        {
            Teams = new HashSet<Team>();
            Players = new HashSet<Player>();
            ScheduleGames = new HashSet<ScheduleGame>();
            ScheduleDivTeams = new HashSet<ScheduleDivTeam>();
        }

        /// <summary>
        /// Gets or sets the unique identifier for the division
        /// </summary>
        [Key]
        [Column("DivisionID")]
        public int DivisionId { get; set; }

        /// <summary>
        /// Gets or sets the company identifier associated with the division
        /// </summary>
        [Column("CompanyID")]
        public int? CompanyId { get; set; }

        /// <summary>
        /// Gets or sets the season identifier this division belongs to
        /// </summary>
        [Column("SeasonID")]
        public int? SeasonId { get; set; }

        /// <summary>
        /// Gets or sets the division description/name
        /// </summary>
        [Required]
        [StringLength(50)]
        [Column("Div_Desc")]
        [Display(Name = "Division Description")]
        public string DivisionDescription { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the director identifier for this division
        /// </summary>
        [Column("DirectorID")]
        [Display(Name = "Director")]
        public int? DirectorId { get; set; }

        /// <summary>
        /// Gets or sets the co-director identifier for this division
        /// </summary>
        [Column("CoDirectorID")]
        [Display(Name = "Co-Director")]
        public int? CoDirectorId { get; set; }

        /// <summary>
        /// Gets or sets the primary gender for this division (M/F)
        /// </summary>
        [StringLength(1)]
        [Display(Name = "Gender")]
        public string Gender { get; set; }

        /// <summary>
        /// Gets or sets the minimum birth date for primary gender eligibility
        /// </summary>
        [Display(Name = "Minimum Birth Date")]
        [DataType(DataType.Date)]
        public DateTime? MinDate { get; set; }

        /// <summary>
        /// Gets or sets the maximum birth date for primary gender eligibility
        /// </summary>
        [Display(Name = "Maximum Birth Date")]
        [DataType(DataType.Date)]
        public DateTime? MaxDate { get; set; }

        /// <summary>
        /// Gets or sets the secondary gender for this division (M/F) - for co-ed divisions
        /// </summary>
        [StringLength(1)]
        [Display(Name = "Secondary Gender")]
        public string Gender2 { get; set; }

        /// <summary>
        /// Gets or sets the minimum birth date for secondary gender eligibility
        /// </summary>
        [Display(Name = "Secondary Minimum Birth Date")]
        [DataType(DataType.Date)]
        public DateTime? MinDate2 { get; set; }

        /// <summary>
        /// Gets or sets the maximum birth date for secondary gender eligibility
        /// </summary>
        [Display(Name = "Secondary Maximum Birth Date")]
        [DataType(DataType.Date)]
        public DateTime? MaxDate2 { get; set; }

        /// <summary>
        /// Gets or sets the draft venue location
        /// </summary>
        [StringLength(50)]
        [Display(Name = "Draft Venue")]
        public string DraftVenue { get; set; }

        /// <summary>
        /// Gets or sets the draft date for this division
        /// </summary>
        [Display(Name = "Draft Date")]
        [DataType(DataType.Date)]
        public DateTime? DraftDate { get; set; }

        /// <summary>
        /// Gets or sets the draft time for this division
        /// </summary>
        [StringLength(10)]
        [Display(Name = "Draft Time")]
        public string DraftTime { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether statistics are tracked for this division
        /// </summary>
        [Display(Name = "Track Statistics")]
        public bool Stats { get; set; }

        /// <summary>
        /// Gets or sets the date and time when the division was created
        /// </summary>
        [Display(Name = "Created Date")]
        public DateTime? CreatedDate { get; set; }

        /// <summary>
        /// Gets or sets the user who created the division record
        /// </summary>
        [StringLength(50)]
        [Display(Name = "Created By")]
        public string CreatedUser { get; set; }

        // Navigation properties
        /// <summary>
        /// Gets or sets the season this division belongs to
        /// </summary>
        public virtual Season Season { get; set; }

        /// <summary>
        /// Gets or sets the director of this division
        /// </summary>
        public virtual Person Director { get; set; }

        /// <summary>
        /// Gets or sets the co-director of this division
        /// </summary>
        public virtual Person CoDirector { get; set; }

        /// <summary>
        /// Gets or sets the collection of teams in this division
        /// </summary>
        public virtual ICollection<Team> Teams { get; set; }

        /// <summary>
        /// Gets or sets the collection of players in this division
        /// </summary>
        public virtual ICollection<Player> Players { get; set; }

        /// <summary>
        /// Gets or sets the collection of schedule games for this division
        /// </summary>
        public virtual ICollection<ScheduleGame> ScheduleGames { get; set; }

        /// <summary>
        /// Gets or sets the collection of schedule division teams for this division
        /// </summary>
        public virtual ICollection<ScheduleDivTeam> ScheduleDivTeams { get; set; }

        // Helper methods
        /// <summary>
        /// Determines if a player is eligible for this division based on birth date and gender
        /// </summary>
        /// <param name="birthDate">The player's birth date</param>
        /// <param name="gender">The player's gender (M/F)</param>
        /// <returns>True if the player is eligible</returns>
        public bool IsPlayerEligible(DateTime birthDate, string gender)
        {
            // Check primary gender eligibility
            if (string.Equals(Gender, gender, StringComparison.OrdinalIgnoreCase))
            {
                return IsDateInRange(birthDate, MinDate, MaxDate);
            }

            // Check secondary gender eligibility (for co-ed divisions)
            if (!string.IsNullOrEmpty(Gender2) && string.Equals(Gender2, gender, StringComparison.OrdinalIgnoreCase))
            {
                return IsDateInRange(birthDate, MinDate2, MaxDate2);
            }

            return false;
        }

        /// <summary>
        /// Gets a formatted string describing the age range for this division
        /// </summary>
        /// <returns>Age range description</returns>
        public string GetAgeRangeDescription()
        {
            var descriptions = new List<string>();

            if (MinDate.HasValue || MaxDate.HasValue)
            {
                var genderText = GetGenderDescription(Gender);
                var ageRange = GetAgeRange(MinDate, MaxDate);
                if (!string.IsNullOrEmpty(ageRange))
                {
                    descriptions.Add($"{genderText}: {ageRange}");
                }
            }

            if (!string.IsNullOrEmpty(Gender2) && (MinDate2.HasValue || MaxDate2.HasValue))
            {
                var genderText = GetGenderDescription(Gender2);
                var ageRange = GetAgeRange(MinDate2, MaxDate2);
                if (!string.IsNullOrEmpty(ageRange))
                {
                    descriptions.Add($"{genderText}: {ageRange}");
                }
            }

            return string.Join(" / ", descriptions);
        }

        /// <summary>
        /// Gets the display name for the division combining description and age range
        /// </summary>
        /// <returns>Formatted division display name</returns>
        public string GetDisplayName()
        {
            var ageRange = GetAgeRangeDescription();
            if (!string.IsNullOrEmpty(ageRange))
            {
                return $"{DivisionDescription} ({ageRange})";
            }
            return DivisionDescription ?? "Unknown Division";
        }

        // Private helper methods
        private bool IsDateInRange(DateTime birthDate, DateTime? minDate, DateTime? maxDate)
        {
            if (minDate.HasValue && birthDate < minDate.Value)
                return false;
            if (maxDate.HasValue && birthDate > maxDate.Value)
                return false;
            return true;
        }

        private string GetGenderDescription(string gender)
        {
            return gender?.ToUpper() switch
            {
                "M" => "Boys",
                "F" => "Girls",
                _ => "Mixed"
            };
        }

        private string GetAgeRange(DateTime? minDate, DateTime? maxDate)
        {
            if (!minDate.HasValue && !maxDate.HasValue)
                return string.Empty;

            var currentDate = DateTime.Now;

            if (minDate.HasValue && maxDate.HasValue)
            {
                var minAge = CalculateAge(maxDate.Value, currentDate);
                var maxAge = CalculateAge(minDate.Value, currentDate);
                return $"Ages {minAge}-{maxAge}";
            }
            else if (minDate.HasValue)
            {
                var maxAge = CalculateAge(minDate.Value, currentDate);
                return $"Age {maxAge} and under";
            }
            else if (maxDate.HasValue)
            {
                var minAge = CalculateAge(maxDate.Value, currentDate);
                return $"Age {minAge} and over";
            }

            return string.Empty;
        }

        private int CalculateAge(DateTime birthDate, DateTime currentDate)
        {
            var age = currentDate.Year - birthDate.Year;
            if (currentDate < birthDate.AddYears(age))
                age--;
            return age;
        }
    }
}
