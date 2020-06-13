using System.Linq;
using System.Data;
using Hoops.Infrastructure.Interface;
//using CSBC.Components;
using Hoops.Core.Entities;
using System.Collections.Generic;

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

        public IQueryable<Team> GetSeasonTeams(int seasonId)
        {
            var teams = context.Teams
                        .Where(team => team.SeasonId == seasonId);
            return teams;
        }

        public IQueryable<Team> GetDivisionTeams(int divisionId)
        {
            var teams = context.Teams
                        .Where(s => s.DivisionId == divisionId);
            return teams;
        }
    }
}

