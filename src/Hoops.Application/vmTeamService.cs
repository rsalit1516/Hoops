using Hoops.Infrastructure.Repository;
using Hoops.Infrastructure.Data;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;

namespace Hoops.Application.DTOs
{
    public class vmTeamService
    {

        public static vmTeam ConvertRecordForTeamNumber(Team team)
        {
            var colorRepo = new ColorRepository(new Hoops.Infrastructure.Data.hoopsContext());
            var newTeam = new vmTeam
            {
                TeamID = team.TeamId,
                // CompanyID = team.CompanyId,
                SeasonID = team.SeasonId ?? 0,
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

