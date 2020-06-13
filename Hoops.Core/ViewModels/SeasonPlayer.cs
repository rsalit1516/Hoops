using System;
using System.ComponentModel.DataAnnotations;

namespace Hoops.Core.ViewModels
{
    public partial class SeasonPlayer
    {
        [Key]
        public int PlayerId { get; set; }
        public int PersonId { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Name { get; set; }
        public int? DivisionId { get; set; }
        public string DivisionDescription { get; set; }
        public string DraftId { get; set; }
        public int? Rating { get; set; }
        public DateTime BirthDate { get; set; }
        public string Address1 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string Phone { get; set; }
        public string Parent1 { get; set; }
        public string Parent2 { get; set; }
        public int Grade { get; set; }
        public decimal Balance { get; set; }
        public string DraftNotes { get; set; }
    }
}