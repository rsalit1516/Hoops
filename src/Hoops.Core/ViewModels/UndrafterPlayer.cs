using System.ComponentModel.DataAnnotations;

namespace Hoops.Core.ViewModels
{
    public partial class UndraftedPlayer
    {
        [Key]
        public int PlayerId { get; set; }
        public int? PersonId { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Name { get; set; }
        public int? Sponsor { get; set; }
        public int SponsorId { get; set; }
        public int DivisionId { get; set; }
        public string DraftId { get; set; }
        public int? Rating { get; set; }
    }
}