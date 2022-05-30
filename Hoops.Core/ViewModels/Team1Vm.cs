using System;

namespace Hoops.Core.ViewModels
{
    public class TeamVM
{
public int CompanyId {get; set;} 
public int SeasonId {get; set;}
public int DivisionId {get; set;}
public int? CoachId {get; set;}
public DateTime CreatedDate {get; set;}
public string CreatedUser {get; set;}
public int? SponsorId {get; set;}
public string TeamColor {get; set;}
public int? TeamColorId {get; set;}
public int? TeamId {get; set;}
public string TeamName {get; set;}
public int? TeamNumber {get; set;}

}
}