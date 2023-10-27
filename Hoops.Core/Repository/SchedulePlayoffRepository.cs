using System;
using System.Collections.Generic;
using System.Linq;
using Hoops.Core;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;
using Hoops.Infrastructure.Interface;
using Microsoft.EntityFrameworkCore;

namespace Hoops.Infrastructure.Repository
{
    public class SchedulePlayoffRepository : EFRepository<SchedulePlayoff>, ISchedulePlayoffRepository
    {
        public SchedulePlayoffRepository(hoopsContext context) : base(context) { }

        #region IRepository<T> Members
        public IQueryable<SchedulePlayoff> GetByDate(DateTime date)
        {
            var games = context.Set<SchedulePlayoff>().Where(s => s.GameDate == date);
            return games;
        }
        public SchedulePlayoff GetByScheduleAndGameNo(int scheduleNo, int gameNo)
        {
            var game = context.Set<SchedulePlayoff>().FirstOrDefault(s => s.ScheduleNumber == scheduleNo && s.GameNumber == gameNo);
            return game;
        }

        #endregion

        public List<PlayoffGameVm> GetGamesBySeasonId(int seasonId)
        {
            var div = context.Set<Division>().Where(d => d.SeasonId == seasonId);
            List<SchedulePlayoff> games = new();
            List<PlayoffGameVm> gamesVm = new();

            var locations = context.Set<Location>();

            foreach (var d in div)
            {
                var divGames = context.Set<SchedulePlayoff>()
                .Where(g => g.DivisionId == d.DivisionId);
             
                games.AddRange(divGames);
            }
            foreach (var game in games)
            {
                gamesVm.Add(GetGameLocation(game, locations));
            }
            return gamesVm; ;
        }

        private PlayoffGameVm GetGameLocation(SchedulePlayoff divGame, DbSet<Location> locations)
        {
            var playoffGame = new PlayoffGameVm
            {
                ScheduleNumber = divGame.ScheduleNumber,
                GameNumber = divGame.GameNumber,
                LocationNumber = divGame.LocationNumber,
                GameDate = divGame.GameDate,
                GameTime = divGame.GameTime,
                VisitingTeam = divGame.VisitingTeam,
                HomeTeam = divGame.HomeTeam,
                Descr = divGame.Descr,
                VisitingTeamScore = divGame.VisitingTeamScore,
                HomeTeamScore = divGame.HomeTeamScore,
                DivisionId = divGame.DivisionId,
                LocationName = locations.FirstOrDefault(l => l.LocationNumber == divGame.LocationNumber)?.LocationName
            };
            return playoffGame;
        }

        public IQueryable<SchedulePlayoff> GetGamesByDivisionId(int divisionId)
        {
            var games = context.Set<SchedulePlayoff>().Where(s =>
            s.DivisionId == divisionId);
            return games;
        }

        public new void Delete(SchedulePlayoff entity)
        {
            var scheduleGame = context.Set<SchedulePlayoff>().FirstOrDefault(g => g.ScheduleNumber == entity.ScheduleNumber &&
                g.GameNumber == entity.GameNumber);
            if (scheduleGame != null)
            {
                context.Set<SchedulePlayoff>().Remove(scheduleGame);
                context.SaveChanges();
            }
        }
        public override SchedulePlayoff Insert(SchedulePlayoff schedulePlayoff)
        {
            if (schedulePlayoff.GameNumber == 0)
                schedulePlayoff.GameNumber = GetNextGameNo((int)schedulePlayoff.ScheduleNumber);
            var game = base.Insert(schedulePlayoff);
            return game;
        }


        private int GetNextGameNo(int scheduleNumber)
        {
            return context.Set<SchedulePlayoff>()
                .Where(g => g.ScheduleNumber == scheduleNumber)
                .Any()
                ?
                (int)(context.Set<SchedulePlayoff>()
                .Where(g => g.ScheduleNumber == scheduleNumber).Max(g => g.GameNumber) + 1) : 1;
        }

        public override SchedulePlayoff Update(SchedulePlayoff schedulePlayoff)
        {
            if (schedulePlayoff == null) throw new ArgumentNullException("SchedulePlayoff");
            var game = GetByScheduleAndGameNo((int)schedulePlayoff.ScheduleNumber, (int)schedulePlayoff.GameNumber);
            Delete(game);
            Insert(schedulePlayoff);
            return schedulePlayoff;
        }
    }
}

