using System;
using System.Collections.Generic;
using System.Linq;
using System.ComponentModel.DataAnnotations;
using Hoops.Core.Models;
using Hoops.Infrastructure.Repository;
using Microsoft.Extensions.Logging;

namespace Hoops.Core.ViewModels
{
    public class TeamViewModel
    {
        public TeamViewModel(int teamId, int divisionId, int teamColorId, string teamNumber)
        {
            this.TeamId = teamId;
            this.DivisionId = divisionId;
            // this.TeamName = teamName;
            this.TeamColorId = teamColorId;
            this.TeamNumber = teamNumber;

        }
        public int TeamId { get; set; }
        public Nullable<int> CompanyId { get; set; }
        public int SeasonId { get; set; }
        public int DivisionId { get; set; }
        public Nullable<int> CoachId { get; set; }
        public Nullable<int> AssCoachId { get; set; }
        public Nullable<int> SponsorId { get; set; }
        [MaxLength(50)]
        public string TeamName { get; set; }
        [MaxLength(50)]
        public string TeamColor { get; set; }
        public int TeamColorId { get; set; }
        public string TeamNumber { get; set; }
        public int TeamNo { get; set; } //kludge for team number being a string in the DB!!

        // public static TeamViewModel ConvertRecordForTeamNumber(Team team)
        // {
        //     var newTeam = new TeamViewModel
        //     {
        //         TeamId = team.TeamId,
        //         // CompanyId = team.CompanyId,
        //         // SeasonId = (int)team.SeasonId,
        //         DivisionId = team.DivisionId,
        //         // CoachId = team.CoachId,
        //         // TeamName = team.TeamName,
        //         TeamNumber = team.TeamNumber,
        //         // TeamColor = team.TeamColor,
        //         TeamColorId = team.TeamColorId
        //     };

        //     int teamNo = 0;
        //     if (Int32.TryParse(team.TeamNumber, out teamNo))
        //     {
        //         newTeam.TeamNo = teamNo;
        //     }
        //     if (String.IsNullOrEmpty(team.TeamName))
        //     {
        //         if (team.TeamColorId > 0)
        //         {
        //             using (var db = new hoopsContext())
        //             {
        //                 newTeam.TeamName = db.Set<Color>().FirstOrDefault(c => c.ColorId == team.TeamColorId).ColorName + " (" + team.TeamNumber.ToString() + ")";
        //             }
        //         }
        //         else
        //             newTeam.TeamName = team.TeamNumber;
        //     }
        //     return newTeam;
        // }
        // public static List<TeamViewModel> GetSeasonTeams(int seasonId)
        // {
        //     using (var db = new hoopsContext())
        //     {
        //         var rep = new TeamRepository(db);
        //         var teams = rep.GetSeasonTeams(seasonId);
        //         var newTeams = new List<TeamViewModel>();
        //         foreach (Team team in teams)
        //         {
        //             newTeams.Add(ConvertRecordForTeamNumber(team));
        //         }
        //         return newTeams;
        //     }
        // }
        // public static List<TeamViewModel> GetDivisionTeams(int divisionId)
        // {
        //     using (var db = new hoopsContext())
        //     {
        //         var rep = new TeamRepository(db);
        //         var teams = rep.GetTeams(divisionId);
        //         var newTeams = new List<TeamViewModel>();
        //         foreach (Team team in teams)
        //         {
        //             newTeams.Add(ConvertRecordForTeamNumber(team));
        //         }
        //         return newTeams;
        //     }
        // }



    }


}