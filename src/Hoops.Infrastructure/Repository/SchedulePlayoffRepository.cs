using System.Globalization;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;
using Hoops.Core.Interface;
using Hoops.Infrastructure.Data;

namespace Hoops.Infrastructure.Repository
{
    public class SchedulePlayoffRepository : EFRepository<SchedulePlayoff>, ISchedulePlayoffRepository
    {
        private readonly ILogger<SchedulePlayoffRepository> _logger;

        public SchedulePlayoffRepository(hoopsContext context) : base(context)
        {
            _logger = new Logger<SchedulePlayoffRepository>(new LoggerFactory());
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
            return game ?? new SchedulePlayoff();
        }

        #endregion

        public IQueryable<PlayoffGameVm> GetGamesBySeasonId(int seasonId)
        {
            _logger.LogInformation("Retrieved " + seasonId.ToString() + " season");

            var div = context.Set<Division>().Where(d => d.SeasonId == seasonId);
            _logger.LogInformation("Retrieved " + div.Count().ToString() + " divisions");
            var locations = context.Set<Location>();
            // var locations = context.Set<Location>();
            _logger.LogInformation("Retrieved " + locations.Count().ToString() + " locations");

            var games = new List<SchedulePlayoff>();
            List<PlayoffGameVm> gamesVm = new();

            var gamesl = context.SchedulePlayoffs
                .Join(context.Divisions, sp => sp.DivisionId, d => d.DivisionId, (sp, d) => new { sp, d })
                .Join(context.Location, spd => spd.sp.LocationNumber, l => l.LocationNumber, (spd, l) => new { spd.sp, spd.d, l })
                .Where(spdl => spdl.d.SeasonId == seasonId)
                .OrderBy(spdl => spdl.sp.GameDate)
                .ThenBy(spdl => spdl.sp.GameTime)
                .Select(spdl => new PlayoffGameVm
                {
                    SchedulePlayoffId = spdl.sp.SchedulePlayoffId,
                    ScheduleNumber = spdl.sp.ScheduleNumber,
                    GameNumber = spdl.sp.GameNumber,
                    LocationNumber = spdl.sp.LocationNumber,
                    GameDate = spdl.sp.GameDate,
                    GameTime = spdl.sp.GameDate.HasValue ? ConvertTime(spdl.sp.GameDate.Value, spdl.sp.GameTime) : spdl.sp.GameTime,
                    VisitingTeam = spdl.sp.VisitingTeam,
                    HomeTeam = spdl.sp.HomeTeam,
                    Descr = spdl.sp.Descr,
                    VisitingTeamScore = spdl.sp.VisitingTeamScore,
                    HomeTeamScore = spdl.sp.HomeTeamScore,
                    DivisionId = spdl.sp.DivisionId,
                    LocationName = spdl.l.LocationName
                });

            return gamesl; ;
        }

        private static string ConvertTime(DateTime gameDate, string gameTime)
        {
            var timeString = gameDate.ToShortDateString() + " " + gameTime;
            DateTime dateTime;

            if (DateTime.TryParseExact(timeString, "HH:mm:ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out dateTime))
            {
                return dateTime.ToString("hh:mm tt");
            }
            else
            {
                return gameTime;
            }
        }
        private List<PlayoffGameVm> GetLocationNames(List<PlayoffGameVm> gamesVm, IQueryable<Location> locations)
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

        private string GetGameLocation(Int32 locationNumber, IQueryable<Location> locations)
        {
            var location = locations.First(l => l.LocationNumber == locationNumber);

            if (location != null)
            {
                return location.LocationName;
            }
            else
            {
                return "no location";
            }
            ;
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

