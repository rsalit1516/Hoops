using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hoops.Core;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;
using Hoops.Infrastructure.Interface;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Hoops.Infrastructure.Repository
{
    public class SchedulePlayoffRepository : EFRepository<SchedulePlayoff>, ISchedulePlayoffRepository
    {
        private readonly ILogger<SchedulePlayoffRepository> _logger;
        public SchedulePlayoffRepository(hoopsContext context) : base(context)
        {
            _logger = new Logger<SchedulePlayoffRepository>(new LoggerFactory());
        }

        public SchedulePlayoffRepository()
        {
            context = new hoopsContext();
        }

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
            _logger.LogInformation("Retrieved " + seasonId.ToString() + " season");

            var div = context.Set<Division>().Where(d => d.SeasonId == seasonId);
            _logger.LogInformation("Retrieved " + div.Count().ToString() + " divisions");
            var locations = context.Set<ScheduleLocation>();
            // var locations = context.Set<Location>();
            _logger.LogInformation("Retrieved " + locations.Count().ToString() + " locations");

            List<SchedulePlayoff> games = new();
            List<PlayoffGameVm> gamesVm = new();

            foreach (var d in div)
            {
                var divGames = context.Set<SchedulePlayoff>()
                .Where(g => g.DivisionId == d.DivisionId);
                _logger.LogInformation("Retrieved " + divGames.Count().ToString() + " division playoff games");

                games.AddRange(divGames);
            }
            foreach (var game in games)
            {
                gamesVm.Add(ConvertGameToGameVm(game));
            }

            gamesVm = GetLocationNames(gamesVm, locations);
            return gamesVm; ;
        }

        private List<PlayoffGameVm> GetLocationNames(List<PlayoffGameVm> gamesVm, IQueryable<ScheduleLocation> locations)
        {
            foreach (var game in gamesVm)
            {
                if (locations.Any())
                {
                    if (game.LocationNumber != null)
                    {
                        game.LocationName = GetGameLocation((int)game.LocationNumber, locations);
                    }
                }
                game.LocationName ??= "no location";
            }
            return gamesVm;
        }

        private PlayoffGameVm ConvertGameToGameVm(SchedulePlayoff divGame)
        {
            _logger.LogInformation(divGame.ToString());
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
            };
            _logger.LogInformation(playoffGame.ToString());
            return playoffGame;
        }

        private string GetGameLocation(Int32 locationNumber, IQueryable<ScheduleLocation> locations)
        {
            var location = locations.First(l => l.LocationNumber == locationNumber);

            if (location != null)
            {
                return location.LocationName;
            }
            else
            {
                return "no location";
            };
            // return "";
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

