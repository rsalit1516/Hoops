﻿
using System.Collections.Generic;
using System.Linq;
using Hoops.Core.Entities;

namespace Hoops.Infrastructure.Interface
{
    public interface ITeamRepository : IRepository<Team>
    {
        IEnumerable<Team> GetAll(int companyId);
        IQueryable<Team> GetTeams(int divisionId);
        int GetNumberofDivisionTeams(int divisionId);
        bool DeleteById(int id);
        IQueryable<Team> GetSeasonTeams(int seasonId);
        IQueryable<Team> GetDivisionTeams(int divisionId);
    }
}
