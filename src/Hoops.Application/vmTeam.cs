using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Hoops.Infrastructure.Repository;
using Hoops.Infrastructure.Data;
using Hoops.Core.Models;

namespace Hoops.Application.DTOs
{
    public class vmTeam
    {
        [Key]
        public int TeamID { get; set; }
        // public Nullable<int> CompanyID { get; set; }
        public int SeasonID { get; set; }
        public int DivisionId { get; set; }
        public Nullable<int> CoachID { get; set; }
        public Nullable<int> AssCoachID { get; set; }
        public Nullable<int> SponsorID { get; set; }
        [MaxLength(50)]
        public string TeamName { get; set; }
        [MaxLength(50)]
        public string TeamColor { get; set; }
        public int TeamColorID { get; set; }
        public string TeamNumber { get; set; }
        public int TeamNo { get; set; } //kludge for team number being a string in the DB!!

        public static vmTeam ConvertRecordForTeamNumber(Team team)
        {
            var colorRepo = new ColorRepository(new hoopsContext());
            var newTeam = new vmTeam
            {
                TeamID = team.TeamId,
                // CompanyID = team.CompanyId,
                SeasonID = (int)team.SeasonId,
                DivisionId = (int)team.DivisionId,
                CoachID = team.CoachId,
                TeamName = team.TeamName,
                TeamNumber = team.TeamNumber,
                TeamColor = team.TeamColor,
                TeamColorID = team.TeamColorId
            };

            int teamNo = 0;
            if (Int32.TryParse(team.TeamNumber, out teamNo))
            {
                newTeam.TeamNo = teamNo;
            }
            if (String.IsNullOrEmpty(team.TeamName))
            {
                if (team.TeamColorId > 0)
                {
                    newTeam.TeamName = colorRepo.GetById(team.TeamColorId).ColorName + " (" + team.TeamNumber.ToString() + ")";
                }
                else
                    newTeam.TeamName = team.TeamNumber;
            }
            return newTeam;
        }

        public static List<vmTeam> GetSeasonTeams(int seasonId)
        {

            using (var db = new hoopsContext())
            {
                var rep = new TeamRepository(db);
                var teams = rep.GetSeasonTeams(seasonId);
                var newTeams = new List<vmTeam>();
                foreach (Team team in teams)
                {
                    newTeams.Add(ConvertRecordForTeamNumber(team));
                }
                return newTeams;
            }
        }
        public static List<vmTeam> GetDivisionTeams(int divisionId)
        {
            using (var db = new hoopsContext())
            {
                var rep = new TeamRepository(db);
                var teams = rep.GetTeams(divisionId);
                var newTeams = new List<vmTeam>();
                foreach (Team team in teams)
                {
                    newTeams.Add(ConvertRecordForTeamNumber(team));
                }
                return newTeams;
            }
        }


    }
}

