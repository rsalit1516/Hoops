﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Core.ViewModels;
using Hoops.Core.Models;

namespace Hoops.Core.Interface
{
    public interface IScheduleGameRepository : IRepository<ScheduleGame>
    {
        IQueryable<ScheduleGame> GetByDate(DateTime date);
        ScheduleGame GetByScheduleAndGameNo(int scheduleNo, int gameNo);
        IEnumerable<ScheduleGame> GetSeasonGames();
        Task<IEnumerable<ScheduleGame>> GetSeasonGamesAsync(int seasonId);
        // new int Update(ScheduleGame scheduleGame);
        new ScheduleGame Insert(ScheduleGame scheduleGame);
        IEnumerable<ScheduleStandingsVM> GetStandings(int divisionId);
        List<vmGameSchedule> GetGames(int seasonId);
        void Add(ScheduleGame scheduleGame);
        Boolean Exists(int id);
    }
}
