using System.Data;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Infrastructure.Data;

namespace Hoops.Infrastructure.Repository
{
    public class TeamRepository : EFRepository<Team>, ITeamRepository
    {
        private readonly ILogger<TeamRepository>? logger;

        public TeamRepository(hoopsContext context, ILogger<TeamRepository> _logger)
            : base(context)
        {
            logger = _logger;
        }

        public TeamRepository(hoopsContext context)
            : base(context) { }
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
            var teams = new List<Team>();
            var divisions = context.Divisions.Where(div => div.SeasonId == seasonId);
            foreach (Division division in divisions)
            {
                var teamDiv = context.Teams.Where(team => team.DivisionId == division.DivisionId);
                var test =
                    from team in teamDiv
                    select new Team()
                    {
                        SeasonId = team.SeasonId,
                        DivisionId = team.DivisionId,
                        TeamName = team.TeamName,
                        TeamColor = team.TeamColor,
                        TeamColorId = team.TeamColorId,
                        TeamNumber = team.TeamNumber,
                    };
                // logger.LogInformation("Division: " + division.DivisionId.ToString() + ": " + division.DivisionDescription);
                foreach (Team team in teamDiv)
                {
                    teams.Add(ConvertRecordForTeamNumber(team, colors));
                }
            }

            return teams ?? new List<Team>();
        }

        public IQueryable<Team> GetDivisionTeams(int divisionId)
        {
            var teams = context.Teams.Where(s => s.DivisionId == divisionId);
            return teams;
        }

        public static Team ConvertRecordForTeamNumber(Team team, List<Color> colors)
        {
            var color = colors.FirstOrDefault(c => c.ColorId == team.TeamColorId);
            team.TeamColor = color?.ColorName;

            var teamNameSuffix = $" ({team.TeamNumber})";
            if (string.IsNullOrEmpty(team.TeamName))
            {
                team.TeamName = team.TeamColor?.ToUpper() ?? string.Empty;
            }
            else if (team.TeamColor != null)
            {
                team.TeamName = $"{team.TeamName} ";
            }

            team.TeamName += teamNameSuffix;
            return team;
        }
    }
}
