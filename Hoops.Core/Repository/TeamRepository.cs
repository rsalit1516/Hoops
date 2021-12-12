using System.Linq;
using System.Data;
using Hoops.Infrastructure.Interface;
//using CSBC.Components;
using Hoops.Core.Models;
using System.Collections.Generic;
using Hoops.Core;
using Hoops.Core.ViewModel;
using System;

namespace Hoops.Infrastructure.Repository
{
    public class TeamRepository : EFRepository<Team>, ITeamRepository
    {

        public TeamRepository(hoopsContext context) : base(context) { }

        #region IRepository<T> Members

        public IEnumerable<Team> GetAll(int companyId)
        {
            return context.Set<Team>().Where(t => t.CompanyId == companyId);
        }


        #endregion


        public IQueryable<Team> GetTeams(int divisionId)
        {
            var teams = context.Set<Team>().Where(s => s.DivisionId == divisionId);
            return teams;
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
            foreach (Team team in context.Teams
                        .Where(team => team.SeasonId == seasonId))
            {
                teams.Add(ConvertRecordForTeamNumber(team, colors));
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
                    team.TeamName = colors.FirstOrDefault(c => c.ColorId == team.TeamColorId).ColorName + " (" + team.TeamNumber.ToString() + ")";
                }
                else
                    team.TeamName = team.TeamNumber;
            }
            return team;
        }
    }
}

