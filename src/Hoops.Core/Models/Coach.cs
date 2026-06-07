using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Hoops.Core.Interface;

namespace Hoops.Core.Models
{
    public partial class Coach : IAuditable
    {
        [Key]
        [Column("CoachID")]
        public int CoachId { get; set; }
        [Column("CompanyID")]
        public int? CompanyId { get; set; }
        [Column("SeasonID")]
        public int? SeasonId { get; set; }
        [Column("PeopleID")]
        public int PersonId { get; set; }
        [Column("PlayerID")]
        public int? PlayerId { get; set; }
        public string ShirtSize { get; set; }
        public string CoachPhone { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? CreatedUser { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? ModifiedUser { get; set; }

        [ForeignKey("PersonId")]
        public virtual Person Person { get; set; }
    }
}
