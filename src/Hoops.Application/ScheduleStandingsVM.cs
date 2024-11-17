using System;
using System.Collections.Generic;
using System.Linq;
using Hoops.Core;
using Hoops.Core.Models;
using Hoops.Core.ViewModels;
using Hoops.Infrastructure.Data;
using Hoops.Infrastructure.Repository;

namespace Hoops.Application;
    public class ScheduleStandingsVMService
    {
       

        public List<ScheduleStandingsVM> CalculateStandings(List<ScheduleGame> games,
        List<Color> colors,
        List<Team> _teams,
        List<ScheduleDivTeam> divTeams,
        int divisionNo)
        {
            //var sql = "Exec GetStanding @ScheduleNumber = " + divisionNo.ToString();
            //DataTable whatIsThis = db.ExecuteGetSQL(sql);

            // var rep = new ScheduleGameRepository(db); //make this a method here....
            // var games = rep.GetSeasonGames(divisionNo).ToList<ScheduleGame>();
            var teams = GetDivisionTeams(colors, _teams, divisionNo);
            var teamRecords = GetTeamRecords(teams, games, divTeams);
            var standings = teamRecords.OrderByDescending(t => t.Pct)
            .ThenByDescending(t => t.Won)
            .ThenBy(t => t.Lost)
            .ThenByDescending(t => (t.PF - t.PA));
            return standings.ToList();
        }

        private List<ScheduleStandingsVM> GetTeamRecords(List<Team> teams, List<ScheduleGame> games, List<ScheduleDivTeam> divTeams)
        {

            var teamRecords = new List<ScheduleStandingsVM>();
            // var rep = new ScheduleGameRepository(db);
            foreach (var team in teams)
            {
                var t = divTeams.FirstOrDefault(t => t.TeamNumber.ToString() == team.TeamNumber);
                var teamRecord = GetTeamRecord(team, t, games);
                teamRecords.Add(teamRecord);
            }
            return teamRecords;
        }

        private ScheduleStandingsVM GetTeamRecord(Team team, ScheduleDivTeam divTeam, List<ScheduleGame> games)
        {
            int teamNo;
            if (team.TeamNumber != null)
            {
                // getting team no!
                if (Int32.TryParse(team.TeamNumber, out teamNo))
                {
                    var scheduleNumber = games.First().ScheduleNumber;
                    // var teamNumber = GetTeamNo(scheduleNumber, teamNo, team.SeasonID);
                    var seasonRecord = new ScheduleStandingsVM
                    {
                        TeamNo = Convert.ToInt32(divTeam.TeamNumber),
                        TeamName = "", // team.TeamName,
                        DivNo = team.DivisionId.ToString(),
                        Won = 0,
                        Lost = 0,
                        PF = 0,
                        PA = 0
                    };

                    var records = games.Where(g => g.HomeTeamNumber.ToString() == team.TeamNumber || g.VisitingTeamNumber.ToString() == team.TeamNumber);
                    foreach (var record in records)
                    {
                        if (record.HomeTeamScore > 0 || record.VisitingTeamScore > 0)
                        {
                            if (team.TeamNumber == record.HomeTeamNumber.ToString())
                            {
                                seasonRecord.PA += record.VisitingTeamScore.HasValue ? (int)record.VisitingTeamScore.Value : 0;
                                seasonRecord.PF += record.HomeTeamScore ?? 0;

                                if (record.HomeTeamScore > record.VisitingTeamScore)
                                    seasonRecord.Won++;
                                else
                                    seasonRecord.Lost++;
                            }
                            else
                            {
                                if (team.TeamNumber == record.VisitingTeamNumber.ToString())
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
                }
                else
                    return new ScheduleStandingsVM();
            }

            return new ScheduleStandingsVM();

        }

        private int GetTeamNo(int divisionNo, int teamNo, int seasonId)
        {
            using (var db = new hoopsContext())
            {
                var schedTeam = db.Set<ScheduleDivTeam>()
                    .FirstOrDefault(t => t.ScheduleNumber == divisionNo
                    && t.ScheduleTeamNumber == teamNo
                    && t.SeasonId == seasonId);
                return schedTeam.TeamNumber;
            }
        }

        private List<Team> GetDivisionTeams(IEnumerable<Color> colors, IEnumerable<Team> teams, int divisionNo)
        {

            // var repoColor = new ColorRepository(db);
            // var colors = repoColor.GetAll(1);
            // var rep = new TeamRepository(db);
            // var teams = rep.GetDivisionTeams(divisionNo);
            var teamsWithColors = new List<Team>();
            foreach (Team team in teams)
            {
                if (String.IsNullOrEmpty(team.TeamName))
                {
                    if (team == null)
                    {
                        if (team.TeamColorId != 0)
                        {
                            var color = colors.FirstOrDefault(c => c.ColorId == team.TeamColorId);
                            team.TeamName = color == null ? "(" + team.TeamNumber + ")" : color.ColorName + "(" + team.TeamNumber + ")";
                        }
                        else
                        {
                            team.TeamName = "(" + team.TeamNumber + ")";
                        }
                    }
                    else
                    {
                        team.TeamName = team.TeamColor + "(" + team.TeamNumber + ")";
                    }

                }
                else
                {

                }
            }
            return teams.ToList();

        }


        private List<Team> GetTeamNames(List<Team> teams, IQueryable<Color> colors)
        {

            foreach (var team in teams)
            {
                //team.Color = colors.FirstOrDefault(c => c.ID == ;
                team.TeamName = team.TeamColor + "(" + team.TeamNumber + ")";
            }
            return teams;
        }
    }
