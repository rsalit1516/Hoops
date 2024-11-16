using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hoops.Core.ViewModels;

public class vmTeam
{
    [Key]
    public int TeamID { get; set; }
    // public Nullable<int> CompanyID { get; set; }
    public int SeasonID { get; set; }
    public int DivisionId { get; set; }
    public int? CoachID { get; set; }
    public int? AssCoachID { get; set; }
    public int? SponsorID { get; set; }
    [MaxLength(50)]
    public string? TeamName { get; set; }
    [MaxLength(50)]
    public string? TeamColor { get; set; }
    public int TeamColorID { get; set; }
    public string? TeamNumber { get; set; }
    public int TeamNo { get; set; } //kludge for team number being a string in the DB!!
}
