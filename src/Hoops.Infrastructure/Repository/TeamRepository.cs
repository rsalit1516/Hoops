using System.Data;
using Hoops.Core.Interface;
using Hoops.Infrastructure.Data;
using Hoops.Core.Models;

namespace Hoops.Infrastructure.Repository
{
    public class TeamRepository : EFRepository<Team>, ITeamRepository
    {
        private readonly ILogger<TeamRepository>? logger;

        public TeamRepository(hoopsContext context, ILogger<TeamRepository> _logger) : base(context)
        {
            logger = _logger;
        }
        public TeamRepository(hoopsContext context) : base(context)
        {
        }
        #region IRepository<T> Members

        // public IEnumerable<Team> GetAll(int companyId)
        // {
        //     return context.Set<Team>().Where(t => t.CompanyId == companyId);
        // }


        #endregion


        public IQueryable<Team> GetTeams(int divisionId)
        {
            var teams = context.Set<Team>().Where(s => s.DivisionId == divisionId);
            return teams!;
        }
        public int GetNumberofDivisionTeams(int divisionId)
        {
            return context.Set<Team>().Where(t => t.DivisionId == divisionId).Count();
        }


        public bool DeleteById(int id)
        {
            bool tflag = false;

            var team = context.Set<Team>().Find(id);
            if (team != null)
            {
                context.Set<Team>().Remove(team);
                context.SaveChanges();
                tflag = true;
            }
            return tflag;
        }

        public List<Team> GetSeasonTeams(int seasonId)
        {
            var colors = context.Colors.Where(x => x.CompanyId == 1).ToList();
            var divisions = context.Divisions.Where(div => div.SeasonId == seasonId);
            var teams = new List<Team>();
            foreach (Division division in divisions)
            {
                var teamDiv = context.Teams
                .Where(team => team.DivisionId == division.DivisionId);
                var test = from team in teamDiv 
                select new Team() { SeasonId = team.SeasonId,
                DivisionId = team.DivisionId,
                TeamName = team.TeamName,
                TeamColor = team.TeamColor,
                TeamColorId = team.TeamColorId,
                TeamNumber = team.TeamNumber 
                };
                // logger.LogInformation("Division: " + division.DivisionId.ToString() + ": " + division.DivisionDescription);
                foreach (Team team in teamDiv)
                {
                    teams.Add(ConvertRecordForTeamNumber(team, colors));
                }
            }
            if (teams != null)
            {
                // logger.LogInformation("Retrieving season teams: " + teams.Count.ToString());
            }
            return teams;
        }

    public IQueryable<Team> GetDivisionTeams(int divisionId)
    {
        var teams = context.Teams
                    .Where(s => s.DivisionId == divisionId);
        return teams;
    }
    public Team ConvertRecordForTeamNumber(Team team, List<Color> colors)
    {
        if (String.IsNullOrEmpty(team.TeamName))
        {
            if (team.TeamColorId > 0)
            {
                // logger.LogInformation(team.TeamColorId.ToString());
                // logger.LogInformation(team.TeamNumber);
                var color = colors.FirstOrDefault(c => c.ColorId == team.TeamColorId);
                if (color != null)
                {
                    team.TeamName = color.ColorName.ToUpper() + " (" + team.TeamNumber.ToString() + ")";
                    if (color != null)
                    {
                        team.TeamColor = color.ColorName;
                    }
                }
                team.TeamColor = color.ColorName;
            }
            else
                team.TeamName = team.TeamNumber;
        }
        return team;
    }
}
}

