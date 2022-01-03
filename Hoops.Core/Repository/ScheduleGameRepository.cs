using System;
using System.Linq;
using Hoops.Infrastructure.Interface;
using System.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Collections.Generic;
using Hoops.Core.ViewModels;
using Hoops.Core.Models;
using Microsoft.Extensions.Logging;
using static Hoops.Core.Enum.GroupTypes;

namespace Hoops.Infrastructure.Repository
{
    public class ScheduleGameRepository : EFRepository<ScheduleGame>, IScheduleGameRepository
    {
        private readonly ILogger<ScheduleGameRepository> _logger;

        public ScheduleGameRepository(Hoops.Core.hoopsContext context, ILogger<ScheduleGameRepository> logger) : base(context)
        {
            _logger = logger;
        }

        //protected hoopsContext DataContext { get; set; }
        #region IRepository<T> Members


        public IQueryable<ScheduleGame> GetByDate(DateTime date)
        {
            var games = context.Set<ScheduleGame>().Where(s => s.GameDate == date);
            return games;
        }

        public ScheduleGame GetByScheduleAndGameNo(ScheduleGame game)
        {
            var result = context.Set<ScheduleGame>().FirstOrDefault(s => s.ScheduleNumber == game.ScheduleNumber && s.GameNumber == game.GameNumber && s.DivisionId == game.DivisionId && s.SeasonId == game.SeasonId);
            return result;
        }

        public IEnumerable<ScheduleGame> GetSeasonGames()
        {
            Season season = context.Seasons.FirstOrDefault(s => s.CurrentSeason == true);
            var games = context.ScheduleGames;
            return games;
        }
        public async Task<IEnumerable<ScheduleGame>> GetSeasonGamesAsync(int seasonId)
        {
            return await context.ScheduleGames
            .Where(season => season.SeasonId == seasonId)
            .ToListAsync();

        }

        public ScheduleGame GetByScheduleGamesId(int scheduleGamesId)
        {
            var result = context.Set<ScheduleGame>().FirstOrDefault(s => s.ScheduleGamesId == scheduleGamesId);
            return result;
        }
        #endregion


        public override void Delete(ScheduleGame entity)
        {

            // var db = new hoopsContext();
            //using (Context)
            //{

            //    using (SqlCommand command = new SqlCommand("delete from ScheduleGames where ScheduleNumber = " + entity.ScheduleNumber.ToString() + " and GameNumber = " + entity.GameNumber.ToString(), connection))
            //    {
            //        command.ExecuteNonQuery();
            //    }

            //}
            var scheduleGame = context.Set<ScheduleGame>().FirstOrDefault(g => g.ScheduleGamesId == entity.ScheduleGamesId);
            if (scheduleGame != null)
            {
                context.Set<ScheduleGame>().Remove(scheduleGame);
                context.SaveChanges();
            }
        }

        public override ScheduleGame Update(ScheduleGame scheduleGame)
        {
            if (scheduleGame == null) throw new ArgumentNullException("scheduleGame");
            //var game = GetByScheduleAndGameNo(scheduleGame);
            var game = GetByScheduleGamesId(scheduleGame.ScheduleGamesId);
            Delete(game);
            Insert(scheduleGame);
            return scheduleGame;
        }

        public override ScheduleGame Insert(ScheduleGame scheduleGame)
        {
            if (scheduleGame.GameNumber == 0)
                scheduleGame.GameNumber = GetNextGameNo(scheduleGame.ScheduleNumber);
            var game = base.Insert(scheduleGame);
            return game;
        }

        private int GetNextGameNo(int scheduleNumber)
        {
            return context.Set<ScheduleGame>()
                .Where(g => g.ScheduleNumber == scheduleNumber)
                .Any()
                ?
                (context.Set<ScheduleGame>()
                .Where(g => g.ScheduleNumber == scheduleNumber).Max(g => g.GameNumber) + 1) : 1;
        }

        // public DataSet GetGames(int iCompanyID, int iDivisionID, int iTeam, string divisionDescription, string sTeamDesc)
        // {
        //     try
        //     {
        //         DataSet retval = new DataSet();
        //         var sqlConn = context.Database.Connection as SqlConnection;
        //         //var sqlConn = entityConn.;
        //         var cmdReport = new SqlCommand("DivGames", sqlConn);
        //         var daReport = new SqlDataAdapter(cmdReport);
        //         using (cmdReport)
        //         {
        //             cmdReport.CommandType = CommandType.StoredProcedure;
        //             cmdReport.Parameters.Add(new SqlParameter("@ScheduleNo", iDivisionID));
        //             cmdReport.Parameters.Add(new SqlParameter("@Div", divisionDescription));
        //             if (iDivisionID > 0)
        //             {
        //                 cmdReport.Parameters.Add(new SqlParameter("@TeamNbr", iTeam));
        //             }
        //             daReport.Fill(retval);
        //             return retval;
        //         }
        //     }
        //     catch (Exception ex)
        //     {
        //         throw new Exception("ClsSchedules:GetGames::" + ex.Message);
        //     }
        // }

        public IEnumerable<ScheduleGame> GetSeasonGames(int divisionId)
        {
            return context.ScheduleGames
            .Where(g => g.DivisionId == divisionId);
        }

        // public void Dispose()
        // {
        //     if (Context != null)
        //     {
        //         context.Dispose();
        //         Context = null;
        //     }
        // }

        public ScheduleGame GetByScheduleAndGameNo(int scheduleNo, int gameNo)
        {
            return context.Set<ScheduleGame>().FirstOrDefault(g => g.ScheduleNumber == scheduleNo && g.GameNumber == gameNo);
        }

        int IScheduleGameRepository.Update(ScheduleGame scheduleGame)
        {
            throw new NotImplementedException();
        }
        public IEnumerable<ScheduleStandingsVM> GetStandings(int divisionId)
        {
            var colors = context.Colors.Where(c => c.CompanyId == 1).ToList();
            _logger.LogInformation("Retrieved colors: " + colors.Count().ToString());

            var teams = context.Teams.Where(s => s.DivisionId == divisionId).ToList();
            _logger.LogInformation("Retrieved Teams: " + teams.Count().ToString());

            var division = context.Divisions.FirstOrDefault(d => d.DivisionId == divisionId);
            _logger.LogInformation("Retrieved divisions: " + division.DivisionId.ToString());

            var divTeams = context.ScheduleDivTeams.Where(div => div.SeasonId == division.SeasonId).ToList();
            _logger.LogInformation("Retrieved division teams: " + divTeams.Count().ToString());

            var seasonGames = this.GetSeasonGames(divisionId).ToList();
            _logger.LogInformation("Retrieved season Games: " + seasonGames.Count().ToString());

            // ScheduleStandingsVM g = new ScheduleStandingsVM();
            var games = new List<ScheduleStandingsVM>();
            if (seasonGames.Any() && colors.Any() && teams.Any()) // && divTeams.Any())
            {
                games = CalculateStandings(seasonGames, colors, teams, divTeams, divisionId);
            }
            return games;
        }

        public List<ScheduleStandingsVM> CalculateStandings(List<ScheduleGame> games,
        List<Color> colors,
        List<Team> _teams,
        List<ScheduleDivTeam> divTeams,
        int divisionNo)
        {
            _logger.LogInformation("*** Start Calculating standings for division " + divisionNo + "***");

            var teams = GetDivisionTeams(colors, _teams, divisionNo);
            _logger.LogInformation("CalculateStandings: Team Names: " + _teams[0].TeamName + " : " + _teams[0].TeamNumber);
            var teamRecords = GetTeamRecords(teams, games, divTeams);
            var standings = teamRecords.OrderByDescending(t => t.Pct)
            .ThenByDescending(t => t.Won)
            .ThenBy(t => t.Lost)
            .ThenByDescending(t => (t.PF - t.PA));
            return standings.ToList();
        }

        private List<ScheduleStandingsVM> GetTeamRecords(List<Team> teams, List<ScheduleGame> games, List<ScheduleDivTeam> divTeams)
        {
            _logger.LogInformation("GetTeamRecords: Teams Count: " + teams.Count());

            var teamRecords = new List<ScheduleStandingsVM>();

            foreach (var team in teams)
            {
                var no = team.DivisionId;
                // _logger.LogInformation("GetTeamRecords: DivTeams: Team ID: " + team.TeamId + "- TeamNumber: " + no);
                // _logger.LogInformation("GetTeamRecords: Team Name: " + team.TeamName);
                var scheduleDivTeamNumber = GetScheduleDivTeamNumber(games, no);
                // _logger.LogInformation("GetTeamRecords: Team No: " + scheduleDivTeamNumber);
                var d = divTeams.FirstOrDefault(t => t.ScheduleNumber == scheduleDivTeamNumber && t.ScheduleTeamNumber == Convert.ToInt32(team.TeamNumber));
                var teamGames = GetTeamGames(scheduleDivTeamNumber, games);
                // _logger.LogInformation("GetTeamRecords: DivTeam found: " + team.TeamNumber);

                var teamRecord = GetTeamRecord(team, d, teamGames);
                teamRecords.Add(teamRecord);
            }
            return teamRecords;
        }

        private int GetScheduleDivTeamNumber(List<ScheduleGame> divGames, int no)
        {
            return divGames.FirstOrDefault(t => t.DivisionId == no).ScheduleNumber;
        }

        private ScheduleStandingsVM GetTeamRecord(Team team, ScheduleDivTeam divTeam, IEnumerable<ScheduleGame> games)
        {
            if (team.TeamNumber != null)
            {
                // getting team no!
                // if (Int32.TryParse(team.TeamNumber, out teamNo))
                // {
                var scheduleNumber = games.First().ScheduleNumber;
                // var teamNumber = GetTeamNo(scheduleNumber, teamNo, team.SeasonID);
                var seasonRecord = new ScheduleStandingsVM
                {
                    TeamNo = Convert.ToInt32(team.TeamNumber),
                    TeamName = team.TeamName,
                    DivNo = team.DivisionId.ToString(),
                    Won = 0,
                    Lost = 0,
                    PF = 0,
                    PA = 0
                };
                // _logger.LogInformation("GetTeamRecord: DivTeam: " + divTeam);

                foreach (var record in games)
                {
                    // _logger.LogInformation("GetTeamRecord: Game Team: Home = " + record.HomeTeamNumber + " Visitor = " + record.VisitingTeamNumber);

                    // _logger.LogInformation("GetTeamRecords: Team scores: Home = " + record.HomeTeamScore + " Visitor = " + record.VisitingTeamScore);
                    if (record.HomeTeamScore > 0 || record.VisitingTeamScore > 0)
                    {
                        // _logger.LogInformation("GetTeamRecords: Team scores: In IF");

                        if (divTeam.TeamNumber == record.HomeTeamNumber)
                        {
                            seasonRecord.PA += (int)record.VisitingTeamScore;
                            seasonRecord.PF += (int)record.HomeTeamScore;

                            if (record.HomeTeamScore > record.VisitingTeamScore)
                            {
                                seasonRecord.Won++;
                                // _logger.LogInformation("GetTeamRecords: Team scores: Won: " + seasonRecord.Won);
                            }
                            else
                            {
                                seasonRecord.Lost++;
                                // _logger.LogInformation("GetTeamRecords: Team scores: Lost: " + seasonRecord.Lost);
                            }
                        }
                        else
                        {
                            if (divTeam.TeamNumber == record.VisitingTeamNumber)
                            {
                                seasonRecord.PF += (int)record.VisitingTeamScore;
                                seasonRecord.PA += (int)record.HomeTeamScore;
                                if (record.VisitingTeamScore > record.HomeTeamScore)
                                    seasonRecord.Won++;
                                else
                                    seasonRecord.Lost++;
                            }
                        }
                    }
                }
                if ((seasonRecord.Won + seasonRecord.Lost) > 0)
                {
                    Decimal Pct = ((decimal)seasonRecord.Won / (decimal)(seasonRecord.Won + seasonRecord.Lost)) * 100;
                    seasonRecord.Pct = Pct;
                }
                else
                    seasonRecord.Pct = 0;
                return seasonRecord;
                // }
                // else
                //     return new ScheduleStandingsVM();
            }
            return new ScheduleStandingsVM();
        }

        private List<ScheduleGame> GetTeamGames(int divTeamNumber, List<ScheduleGame> games)
        {
            // _logger.LogInformation("GetTeamGames: Team Div Number: " + divTeamNumber);
            var sg = new List<ScheduleGame>();
            foreach (var g in games)
            {
                if (g.HomeTeamNumber == divTeamNumber)
                {
                    _logger.LogInformation("GetTeamGames: Found one");

                    sg.Add(g);
                }
                else
                {
                    if (g.VisitingTeamNumber == divTeamNumber)
                        _logger.LogInformation("GetTeamGames: Found one");
                    { sg.Add(g); }
                }
            }
            return sg;
        }
        private List<Team> GetDivisionTeams(List<Color> colors, List<Team> teams, int divisionNo)
        {
            var teamsWithColors = new List<Team>();
            foreach (Team team in teams)
            {
                // _logger.LogInformation("GetDivisionTeams: " + team.TeamName);
                if (String.IsNullOrEmpty(team.TeamName))
                {
                    // if (team == null)
                    // {
                    // _logger.LogInformation("GetDivisionTeams: Team Number" + team.TeamNumber);

                    // _logger.LogInformation("GetDivisionTeams: ColorID" + team.TeamColorId);
                    if (team.TeamColorId != 0)
                    {
                        var color = colors.FirstOrDefault(c => c.ColorId == team.TeamColorId);
                        // _logger.LogInformation("GetDivisionTeams: Color Name: " + color.ColorName);
                        team.TeamName = color == null ? "(" + team.TeamNumber + ")" : color.ColorName + "(" + team.TeamNumber + ")";
                    }
                    else
                    {
                        team.TeamName = "(" + team.TeamNumber + ")";
                    }
                    // }
                    // else
                    // {
                    //     team.TeamName = team.TeamColor + "(" + team.TeamNumber + ")";
                }
                // }
                else
                {
                    team.TeamName = team.TeamNumber;
                }
                _logger.LogInformation("GetDivisionTeams: Team Name: " + team.TeamName);

            }
            _logger.LogInformation("GetDivisionTeams: Team Names: " + teams[0].TeamName);
            _logger.LogInformation("GetDivisionTeams: Team Names: " + teams[1].TeamName);
            return teams.ToList();
        }

        public List<GameSchedulesViewModel> GetGames(int seasonId)
        {
            var startTime = DateTime.Now;
            _logger.LogInformation("ScheduledGames: GetGames - start basic query" + startTime);

            using (var db = context)
            {
                var result = (from d in db.Divisions
                              from g in db.ScheduleGames
                              from l in db.ScheduleLocations

                              where g.SeasonId == seasonId
                              where g.DivisionId == d.DivisionId
                              where g.LocationNumber == l.LocationNumber
                              select new GameSchedulesViewModel
                              {
                                  SeasonId = seasonId,
                                  DivisionDescription = d.DivisionDescription,
                                  DivisionId = (int)g.DivisionId,
                                  GameDate = g.GameDate,
                                  GameTimeString = g.GameTime,
                                  LocationName = l.LocationName,
                                  GameNumber = g.GameNumber,
                                  VisitingTeamNumber = g.VisitingTeamNumber,
                                  HomeTeamNumber = g.HomeTeamNumber,
                                  ScheduleNumber = g.ScheduleNumber,
                                  HomeTeamScore = g.HomeTeamScore == -1 ? 0 : (int)g.HomeTeamScore,
                                  VisitingTeamScore = g.VisitingTeamScore == -1 ? 0 : (int)g.VisitingTeamScore,
                                  GameType = GameTypes.Regular
                              });

                var afterBasicQuery = DateTime.Now;
                // _logger.LogInformation("ScheduledGames: GetGames - basic query" + afterBasicQuery + ", " + (startTime - afterBasicQuery));

                var games = GetTeamNamesFromScheduledGames(result);
                var afterGettingTeamNames = DateTime.Now;
                // _logger.LogInformation("ScheduledGames: GetGames - after getting team Names" + afterGettingTeamNames + ", " + (afterBasicQuery - afterGettingTeamNames));
                _logger.LogInformation("Retrieved " + games.Count.ToString() + " season games");
                var playoffGames = GetSeasonPlayoffGames(seasonId);
                _logger.LogInformation("Retrieved " + playoffGames.Count.ToString() + " playoff games");
                games.AddRange(playoffGames);
                _logger.LogInformation("Retrieved " + games.Count.ToString() + " total season games");
                return games;
            }
        }
        private List<GameSchedulesViewModel> GetTeamNamesFromScheduledGames(IQueryable<GameSchedulesViewModel> result)
        {
            var db = context;
            List<GameSchedulesViewModel> games = new List<GameSchedulesViewModel>();
            var seasonId = result.First().SeasonId;
            var teamRepo = new TeamRepository(db);
            //var teams = TeamViewModel.GetDivisionTeams(result.FirstOrDefault<GameSchedulesViewModel>().DivisionId);
            var teams = teamRepo.GetSeasonTeams((int)seasonId);
            var schedDiv = db.Set<ScheduleDivTeam>().Where(s => s.SeasonId == seasonId).ToList();

            // var repoColor = new ColorRepository(context);
            // var colors = repoColor.GetAll(1);
            foreach (GameSchedulesViewModel game in result)
            {
                //first get real game time
                DateTime time;
                if (DateTime.TryParse(game.GameTimeString, out time))
                    game.GameTime = time;
                game.GameDate = CombineDateAndTime(game.GameDate, game.GameTime);
                game.VisitingTeamSeasonNumber = GetTeam(schedDiv, game.ScheduleNumber, (int)game.VisitingTeamNumber, seasonId).ScheduleTeamNumber;

                if (teams.Any())
                {
                    var team = teams.FirstOrDefault(t => Convert.ToInt32(t.TeamNumber) == game.VisitingTeamSeasonNumber && t.DivisionId == game.DivisionId);
                    if (team != null)
                    {
                        //                        var color = colors.FirstOrDefault(c => c.ColorId == team.TeamColorId);
                        game.VisitingTeamName = team.TeamName; // color.ColorName + "(" + team.TeamNumber + ")";
                        game.VisitingTeamId = team.TeamId;
                    }
                }
                game.HomeTeamSeasonNumber = GetTeam(schedDiv, game.ScheduleNumber, (int)game.HomeTeamNumber, seasonId).ScheduleTeamNumber;

                if (teams.Any()) ////get teamId!
                {
                    var team = teams.FirstOrDefault(t => Convert.ToInt32(t.TeamNumber) == game.HomeTeamSeasonNumber && t.DivisionId == game.DivisionId);
                    if (team != null)
                    {
                        // var color = colors.FirstOrDefault(c => c.ColorId == team.TeamColorId);
                        game.HomeTeamName = team.TeamName; ; //color.ColorName + "(" + team.TeamNumber + ")";
                        game.HomeTeamId = team.TeamId;
                    }
                }
                games.Add(game);
            }
            return games;

        }

        private ScheduleDivTeam GetTeam(List<ScheduleDivTeam> schedDiv, int gameNo, int teamNo, int? seasonId)
        {
            return schedDiv.FirstOrDefault(s => s.ScheduleNumber == gameNo &&
                s.TeamNumber == teamNo &&
                s.SeasonId == seasonId);
        }

        private List<GameSchedulesViewModel> GetPlayoffGames(int divisionId)
        {
            using (var db = context)
            {
                var games = (from g in db.SchedulePlayoffs
                             from l in db.ScheduleLocations
                             from d in db.Divisions
                             where g.DivisionId == divisionId
                             where g.LocationNumber == l.LocationNumber
                             where g.DivisionId == d.DivisionId
                             select new
                             {
                                 g.ScheduleNumber,
                                 d.DivisionId,
                                 g.GameDate,
                                 g.GameTime,
                                 d.DivisionDescription,
                                 g.LocationNumber,
                                 l.LocationName,
                                 g.GameNumber,
                                 g.HomeTeam,
                                 g.VisitingTeam,
                                 g.Descr
                             });
                var schedGames = new List<GameSchedulesViewModel>();
                DateTime time;
                foreach (var g in games)
                {
                    var game = new GameSchedulesViewModel();

                    game.ScheduleNumber = g.ScheduleNumber;
                    //game.DivisionId = g.DivisionId;
                    game.GameDate = (DateTime)g.GameDate;
                    if (DateTime.TryParse(g.GameTime, out time))
                        game.GameTime = time;
                    //game.D = g.Div_Desc;
                    //game.LocationNumber = (int)g.LocationNumber;
                    game.LocationName = g.LocationName;
                    game.GameNumber = g.GameNumber;
                    game.HomeTeamName = g.HomeTeam;
                    game.VisitingTeamName = g.VisitingTeam;
                    game.GameDescription = g.Descr;
                    //game.GameType = GameTypes.Playoff;
                    schedGames.Add(game);
                }

                if (divisionId != 0)
                {
                    schedGames = schedGames
                    .OrderBy(g => g.GameDate).ThenBy(g => g.GameTime).ThenBy(g => g.DivisionId).ToList<GameSchedulesViewModel>();
                }
                return schedGames;
            }
        }
        private List<GameSchedulesViewModel> GetSeasonPlayoffGames(int seasonId)
        {
            using (var db = context)
            {
                var games = (from g in db.SchedulePlayoffs
                             from l in db.ScheduleLocations
                             from d in db.Divisions
                             where g.DivisionId == d.DivisionId
                             where g.LocationNumber == l.LocationNumber
                             where d.SeasonId == seasonId
                             select new
                             {
                                 g.ScheduleNumber,
                                 d.DivisionId,
                                 g.GameDate,
                                 g.GameTime,
                                 d.DivisionDescription,
                                 g.LocationNumber,
                                 l.LocationName,
                                 g.GameNumber,
                                 g.HomeTeam,
                                 g.VisitingTeam,
                                 g.Descr
                             });
                var schedGames = new List<GameSchedulesViewModel>();
                DateTime time;
                foreach (var g in games)
                {
                    var game = new GameSchedulesViewModel();

                    game.ScheduleNumber = g.ScheduleNumber;
                    game.DivisionId = g.DivisionId;
                    game.GameDate = (DateTime)g.GameDate;
                    if (DateTime.TryParse(g.GameTime, out time))
                        game.GameTime = time;
                    game.DivisionDescription = g.DivisionDescription;
                    //game.LocationNumber = (int)g.LocationNumber;
                    game.SeasonId = seasonId;
                    game.LocationName = g.LocationName;
                    game.GameNumber = g.GameNumber;
                    game.HomeTeamName = g.HomeTeam;
                    game.VisitingTeamName = g.VisitingTeam;
                    game.GameDescription = g.Descr;
                    game.GameType = GameTypes.Playoff;
                    schedGames.Add(game);
                }

                // if (divisionId != 0)
                // {
                schedGames = schedGames
                .OrderBy(g => g.GameDate).ThenBy(g => g.GameTime).ThenBy(g => g.DivisionId).ToList<GameSchedulesViewModel>();
                // }
                return schedGames;
            }
        }
        private static DateTime CombineDateAndTime(DateTime date, DateTime time)
        {
            var dateString = date.ToShortDateString() + " " + time.ToShortTimeString();
            DateTime newDate = date;
            if (DateTime.TryParse(dateString, out newDate))
                date = newDate;
            return newDate;
        }
    }
}

