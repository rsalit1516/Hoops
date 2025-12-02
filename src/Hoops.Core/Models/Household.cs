using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hoops.Core.Models
{
    /// <summary>
    /// Represents a household entity that can contain multiple people/family members
    /// </summary>
    public partial class Household
    {
        /// <summary>
        /// Initializes a new instance of the Household class
        /// </summary>
        public Household()
        {
            People = new HashSet<Person>();
        }

        /// <summary>
        /// Gets or sets the unique identifier for the household
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        [Column("HouseID")]
        public int HouseId { get; set; }

        /// <summary>
        /// Gets or sets the company identifier associated with the household
        /// </summary>
        [Column("CompanyID")]
        public int? CompanyId { get; set; }

        /// <summary>
        /// Gets or sets the household name
        /// </summary>
        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the primary phone number for the household
        /// </summary>
        [StringLength(25)]
        [Phone]
        public string Phone { get; set; }

        /// <summary>
        /// Gets or sets the primary address line 1
        /// </summary>
        [StringLength(50)]
        public string Address1 { get; set; }

        /// <summary>
        /// Gets or sets the secondary address line 2
        /// </summary>
        [StringLength(50)]
        public string Address2 { get; set; }

        /// <summary>
        /// Gets or sets the city
        /// </summary>
        [StringLength(50)]
        public string City { get; set; }

        /// <summary>
        /// Gets or sets the state (2 character state code)
        /// </summary>
        [StringLength(2)]
        public string State { get; set; }

        /// <summary>
        /// Gets or sets the zip code
        /// </summary>
        [StringLength(20)]
        public string Zip { get; set; }

        /// <summary>
        /// Gets or sets the primary email address for the household
        /// </summary>
        [StringLength(50)]
        [EmailAddress]
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the household is subscribed to email lists
        /// </summary>
        public bool? EmailList { get; set; }

        /// <summary>
        /// Gets or sets the sports card information
        /// </summary>
        [StringLength(15)]
        public string SportsCard { get; set; }

        /// <summary>
        /// Gets or sets the guardian person identifier
        /// </summary>
        public int? Guardian { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether fees are waived for this household
        /// </summary>
        public bool? FeeWaived { get; set; }

        /// <summary>
        /// Gets or sets the date and time when the household was created
        /// </summary>
        [Display(Name = "Created Date")]
        public DateTime? CreatedDate { get; set; }

        /// <summary>
        /// Gets or sets the user who created the household record
        /// </summary>
        [StringLength(20)]
        [Display(Name = "Created By")]
        public string CreatedUser { get; set; }

        /// <summary>
        /// Gets or sets the team identifier associated with the household
        /// </summary>
        [Column("TEMID")]
        public int? TeamId { get; set; }

        // Navigation properties
        /// <summary>
        /// Gets or sets the collection of people associated with this household
        /// </summary>
        public virtual ICollection<Person> People { get; set; }
    }
}
