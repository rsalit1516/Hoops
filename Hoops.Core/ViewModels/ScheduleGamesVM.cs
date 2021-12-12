using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using Hoops.Infrastructure.Repository;
using Hoops.Core.Models;

namespace Hoops.Core.ViewModels
{
    public class GameSchedulesViewModel
    {
        public int DivisionId { get; set; }
        public Nullable<int> CompanyId { get; set; }
        public Nullable<int> SeasonId { get; set; }
        public string DivisionDescription { get; set; }
        public DateTime GameDate { get; set; }
        public String GameTimeString { get; set; }
        public DateTime GameTime { get; set; }
        public string LocationName { get; set; }
        public int GameNumber { get; set; }
        public int? VisitingTeamNumber { get; set; }
        public int? HomeTeamNumber { get; set; }
        public int VisitingTeamSeasonNumber { get; set; }
        public int HomeTeamSeasonNumber { get; set; }
        public string VisitingTeamName { get; set; }
        public string HomeTeamName { get; set; }
        public int ScheduleNumber { get; set; }
        public int HomeTeamScore { get; set; }
        public int VisitingTeamScore { get; set; }
        public string GameDescription { get; set; }
        public int VisitingTeamId { get; set; }
        public int HomeTeamId { get; set; }

        public List<GameSchedulesViewModel> GetGames(int seasonId)
        {
            using (var db = new hoopsContext())
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
                                  VisitingTeamScore = g.VisitingTeamScore == -1 ? 0 : (int)g.VisitingTeamScore
                              });

                //List<TeamViewModel> teams;
                // var games = GetTeamNamesFromScheduledGames(db, result);
                // var playoffGames = GetPlayoffGames(seasonId);
                // games.AddRange(playoffGames);
                return result.ToList();
            }
        }


        public List<GameSchedulesViewModel> GetGames(int seasonId, int divisionId)
        {
            using (var db = new hoopsContext())
            {
                var result = (from d in db.Divisions
                              from g in db.ScheduleGames
                              from l in db.ScheduleLocations
                              where g.SeasonId == seasonId
                              where g.DivisionId == divisionId
                              where g.LocationNumber == l.LocationNumber
                              where d.DivisionId == g.DivisionId
                              select new GameSchedulesViewModel
                              {
                                  DivisionDescription = d.DivisionDescription,
                                  DivisionId = d.DivisionId,
                                  SeasonId = seasonId,
                                  GameDate = g.GameDate,
                                  GameTimeString = g.GameTime,
                                  LocationName = l.LocationName,
                                  GameNumber = g.GameNumber,
                                  VisitingTeamNumber = g.VisitingTeamNumber,
                                  HomeTeamNumber = g.HomeTeamNumber,
                                  ScheduleNumber = g.ScheduleNumber,
                                  HomeTeamScore = (int)g.HomeTeamScore,
                                  VisitingTeamScore = (int)g.VisitingTeamScore
                              });
                //List<TeamViewModel> teams;
                var games = GetTeamNamesFromScheduledGames(db, result);
                var playoffGames = GetPlayoffGames(divisionId);
                games.AddRange(playoffGames);

                return games;
            }
        }
        public List<GameSchedulesViewModel> GetGames(int seasonId, int divisionId, int teamId)
        {
            using (var db = new hoopsContext())
            {
                var rep = new TeamRepository(db);
                var team = rep.GetById(teamId);
                int teamNo;
                if (Int32.TryParse(team.TeamNumber, out teamNo))
                {
                    var scheduleNumber = db.Set<ScheduleGame>()
                        .FirstOrDefault(g => g.DivisionId == divisionId).ScheduleNumber;
                    var teamNumber = db.Set<ScheduleDivTeam>()
                        .FirstOrDefault(s => s.ScheduleTeamNumber == teamNo && s.ScheduleNumber == scheduleNumber).TeamNumber;

                    var result = (from t in db.Teams
                                  from g in db.ScheduleGames
                                  from l in db.ScheduleLocations

                                  where g.SeasonId == seasonId
                                  where t.TeamId == teamId
                                  where (g.VisitingTeamNumber == teamNumber || g.HomeTeamNumber == teamNumber)
                                  where g.ScheduleNumber == scheduleNumber
                                  where g.LocationNumber == l.LocationNumber
                                  select new GameSchedulesViewModel
                                  {
                                      DivisionId = t.DivisionId,
                                      SeasonId = g.SeasonId,
                                      GameDate = g.GameDate,
                                      GameTimeString = g.GameTime,
                                      LocationName = l.LocationName,
                                      GameNumber = g.GameNumber,
                                      VisitingTeamNumber = g.VisitingTeamNumber,
                                      HomeTeamNumber = g.HomeTeamNumber,
                                      ScheduleNumber = g.ScheduleNumber,
                                      HomeTeamScore = (int)g.HomeTeamScore,
                                      VisitingTeamScore = (int)g.VisitingTeamScore
                                  });
                    //List<TeamViewModel> teams;
                    //var count = result.Count<GameSchedulesViewModel>();
                    var games = GetTeamNamesFromScheduledGames(db, result);
                    var playoffGames = GetPlayoffGames(divisionId);
                    games.AddRange(playoffGames);
                    return games;
                }
                else
                {
                    return new List<GameSchedulesViewModel>();
                }
            }
        }
        private static List<GameSchedulesViewModel> GetTeamNamesFromScheduledGames(hoopsContext db, IQueryable<GameSchedulesViewModel> result)
        {
            List<GameSchedulesViewModel> games = new List<GameSchedulesViewModel>();
            var seasonId = result.First().SeasonId;
            //var teams = TeamViewModel.GetDivisionTeams(result.FirstOrDefault<GameSchedulesViewModel>().DivisionId);
            var teams = TeamViewModel.GetSeasonTeams((int)seasonId);
            var schedDiv = db.Set<ScheduleDivTeam>().Where(s => s.SeasonId == seasonId).ToList();
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
                    var team = teams.FirstOrDefault(t => t.TeamNo == game.VisitingTeamSeasonNumber && t.DivisionId == game.DivisionId);
                    if (team != null)
                    {
                        game.VisitingTeamName = team.TeamName;
                        game.VisitingTeamId = team.TeamId;
                    }
                }
                game.HomeTeamSeasonNumber = GetTeam(schedDiv, game.ScheduleNumber, (int)game.HomeTeamNumber, seasonId).ScheduleTeamNumber;

                if (teams.Any()) ////get teamId!
                {
                    var team = teams.FirstOrDefault(t => t.TeamNo == game.HomeTeamSeasonNumber && t.DivisionId == game.DivisionId);
                    if (team != null)
                    {
                        game.HomeTeamName = team.TeamName;
                        game.HomeTeamId = team.TeamId;
                    }
                }
                games.Add(game);
            }
            return games;

        }

        private static ScheduleDivTeam  GetTeam(List<ScheduleDivTeam> schedDiv, int gameNo, int teamNo, int? seasonId )
        {
            return schedDiv.FirstOrDefault(s => s.ScheduleNumber == gameNo &&
                s.TeamNumber == teamNo &&
                s.SeasonId == seasonId );
        }

        private List<GameSchedulesViewModel> GetPlayoffGames(int divisionId)
        {
            using (var db = new hoopsContext())
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
        private static DateTime CombineDateAndTime(DateTime date, DateTime time)
        {
            var dateString = date.ToShortDateString() + " " + time.ToShortTimeString();
            DateTime newDate = date;
            if (DateTime.TryParse(dateString, out newDate))
                date = newDate;
            return newDate;
        }

        public static void UpdateScore(int gameNo, int divisionId, int homeScore, int visitorScore)
        {
            using (var db = new hoopsContext())
            {
                // var rep = new ScheduleGameRepository(db);
                // var game = db.ScheduleGames.FirstOrDefault(g => g.GameNumber == gameNo && g.DivisionId == divisionId);
                // if (game != null)
                // {
                //     game.HomeTeamScore = homeScore;
                //     game.VisitingTeamScore = visitorScore;
                //     rep.Update(game);

                // }

            }
        }

    }


}