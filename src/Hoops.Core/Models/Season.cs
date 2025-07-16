using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hoops.Core.Models
{
    /// <summary>
    /// Represents a sports season with registration periods, fees, and associated divisions/teams
    /// </summary>
    [Table("Seasons")]
    public partial class Season
    {
        /// <summary>
        /// Initializes a new instance of the Season class
        /// </summary>
        public Season()
        {
            Divisions = new HashSet<Division>();
            Teams = new HashSet<Team>();
            Players = new HashSet<Player>();
            Coaches = new HashSet<Coach>();
            Sponsors = new HashSet<Sponsor>();
            ScheduleGames = new HashSet<ScheduleGame>();
        }

        /// <summary>
        /// Gets or sets the unique identifier for the season
        /// </summary>
        [Key]
        [Column("SeasonID")]
        public int SeasonId { get; set; }
        
        /// <summary>
        /// Gets or sets the company identifier associated with the season
        /// </summary>
        [Column("CompanyID")]
        public int? CompanyId { get; set; }
        
        /// <summary>
        /// Gets or sets the season description/name
        /// </summary>
        [Required]
        [StringLength(50)]
        [Column("Sea_Desc")]
        [Display(Name = "Season Description")]
        public string Description { get; set; } = string.Empty;
        
        /// <summary>
        /// Gets or sets the start date of the season
        /// </summary>
        [Display(Name = "Season Start Date")]
        [DataType(DataType.Date)]
        public DateTime? FromDate { get; set; }
        
        /// <summary>
        /// Gets or sets the end date of the season
        /// </summary>
        [Display(Name = "Season End Date")]
        [DataType(DataType.Date)]
        public DateTime? ToDate { get; set; }
        
        /// <summary>
        /// Gets or sets the participation fee for players
        /// </summary>
        [Display(Name = "Player Fee")]
        [DataType(DataType.Currency)]
        [Range(0, 10000, ErrorMessage = "Participation fee must be between $0 and $10,000")]
        public decimal? ParticipationFee { get; set; }
        
        /// <summary>
        /// Gets or sets the sponsor fee for the season
        /// </summary>
        [Display(Name = "Sponsor Fee")]
        [DataType(DataType.Currency)]
        [Range(0, 10000, ErrorMessage = "Sponsor fee must be between $0 and $10,000")]
        public decimal? SponsorFee { get; set; }
        
        /// <summary>
        /// Gets or sets the convenience fee for online transactions
        /// </summary>
        [Display(Name = "Convenience Fee")]
        [DataType(DataType.Currency)]
        [Range(0, 1000, ErrorMessage = "Convenience fee must be between $0 and $1,000")]
        public decimal? ConvenienceFee { get; set; }
        
        /// <summary>
        /// Gets or sets a value indicating whether this is the current active season
        /// </summary>
        [Display(Name = "Current Season")]
        public bool? CurrentSeason { get; set; }
        
        /// <summary>
        /// Gets or sets a value indicating whether this season has the current schedule
        /// </summary>
        [Display(Name = "Current Schedule")]
        public bool? CurrentSchedule { get; set; }
        
        /// <summary>
        /// Gets or sets a value indicating whether sign-ups are currently open
        /// </summary>
        [Display(Name = "Sign-ups Open")]
        public bool? CurrentSignUps { get; set; }
        
        /// <summary>
        /// Gets or sets the date when sign-ups begin
        /// </summary>
        [Display(Name = "Sign-ups Start Date")]
        [DataType(DataType.Date)]
        public DateTime? SignUpsDate { get; set; }
        
        /// <summary>
        /// Gets or sets the date when sign-ups end
        /// </summary>
        [Column("SignUpsEND")]
        [Display(Name = "Sign-ups End Date")]
        [DataType(DataType.Date)]
        public DateTime? SignUpsEnd { get; set; }
        
        /// <summary>
        /// Gets or sets a value indicating whether this is a test season
        /// </summary>
        [Display(Name = "Test Season")]
        public bool? TestSeason { get; set; }
        
        /// <summary>
        /// Gets or sets a value indicating whether this season starts a new school year
        /// </summary>
        [Display(Name = "New School Year")]
        public bool? NewSchoolYear { get; set; }
        
        /// <summary>
        /// Gets or sets the date and time when the season was created
        /// </summary>
        [Display(Name = "Created Date")]
        public DateTime? CreatedDate { get; set; }
        
        /// <summary>
        /// Gets or sets the user who created the season record
        /// </summary>
        [StringLength(50)]
        [Display(Name = "Created By")]
        public string CreatedUser { get; set; }

        // Navigation properties
        /// <summary>
        /// Gets or sets the collection of divisions associated with this season
        /// </summary>
        public virtual ICollection<Division> Divisions { get; set; }
        
        /// <summary>
        /// Gets or sets the collection of teams associated with this season
        /// </summary>
        public virtual ICollection<Team> Teams { get; set; }
        
        /// <summary>
        /// Gets or sets the collection of players associated with this season
        /// </summary>
        public virtual ICollection<Player> Players { get; set; }
        
        /// <summary>
        /// Gets or sets the collection of coaches associated with this season
        /// </summary>
        public virtual ICollection<Coach> Coaches { get; set; }
        
        /// <summary>
        /// Gets or sets the collection of sponsors associated with this season
        /// </summary>
        public virtual ICollection<Sponsor> Sponsors { get; set; }
        
        /// <summary>
        /// Gets or sets the collection of schedule games associated with this season
        /// </summary>
        public virtual ICollection<ScheduleGame> ScheduleGames { get; set; }
        
        // Helper methods
        /// <summary>
        /// Determines if the season is currently active for sign-ups
        /// </summary>
        /// <returns>True if sign-ups are open and within the date range</returns>
        public bool IsSignUpPeriodActive()
        {
            var now = DateTime.Now;
            return CurrentSignUps == true && 
                   SignUpsDate.HasValue && SignUpsDate.Value <= now &&
                   SignUpsEnd.HasValue && SignUpsEnd.Value >= now;
        }
        
        /// <summary>
        /// Determines if the season is currently in progress
        /// </summary>
        /// <returns>True if the season is within the from/to date range</returns>
        public bool IsSeasonActive()
        {
            var now = DateTime.Now;
            return FromDate.HasValue && FromDate.Value <= now &&
                   ToDate.HasValue && ToDate.Value >= now;
        }
        
        /// <summary>
        /// Gets the display name for the season combining description and date range
        /// </summary>
        /// <returns>Formatted season display name</returns>
        public string GetDisplayName()
        {
            if (FromDate.HasValue && ToDate.HasValue)
            {
                return $"{Description} ({FromDate.Value:MM/yyyy} - {ToDate.Value:MM/yyyy})";
            }
            return Description ?? "Unknown Season";
        }
        
        //public decimal PlayerFee { get; set; }
    }
}
