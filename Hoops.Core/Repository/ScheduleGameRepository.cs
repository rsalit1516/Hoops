using System;
using System.Linq;
using Hoops.Infrastructure.Interface;
using System.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Collections.Generic;
using Hoops.Core.ViewModels;
using Hoops.Core.Models;

namespace Hoops.Infrastructure.Repository
{
    public class ScheduleGameRepository : EFRepository<ScheduleGame>, IScheduleGameRepository
    {
        public ScheduleGameRepository(Hoops.Core.hoopsContext context) : base(context) { }

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
            var repoColor = new ColorRepository(context);
            var colors = repoColor.GetAll(1);
            var rep = new TeamRepository(context);
            var teams = rep.GetDivisionTeams(divisionId);
            var divTeams = context.ScheduleDivTeams.Where(div => div.DivisionNumber == divisionId);

            var games = new ScheduleStandingsVM().CalculateStandings(this.GetSeasonGames(divisionId).ToList(), colors, teams, divTeams, divisionId);
            return games;
        }
    }
}

