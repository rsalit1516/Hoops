using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;

using Hoops.Core;
using Hoops.Core.Models;
using Hoops.Infrastructure.Interface;

namespace Hoops.Infrastructure.Repository
{
    public class SeasonRepository : EFRepository<Season>, ISeasonRepository
    {
        public SeasonRepository(hoopsContext _context) : base(_context) {}

        #region IRepository<T> Members
        public async Task<List<Season>> GetAllAsync(int companyId) =>
            await context.Seasons
            .Where(s => s.CompanyId == companyId)
                .OrderByDescending(c => c.FromDate)
                .ToListAsync();


        #endregion // context.Set<Season>().Where(s => s.CompanyId == companyId);


        public Season GetSeason(int companyId, int seasonId = 0)
        {
            try
            {
                var season =
                    context
                        .Set<Season>()
                        .Where(s =>
                            s.CompanyId == companyId && s.SeasonId == seasonId);
                return season.First();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<Season> GetCurrentSeason(int companyId)
        {
            try
            {
                var season =
                    context
                        .Set<Season>()
                        .FirstOrDefaultAsync(n =>
                            (n.CurrentSeason == true) &&
                            (n.CompanyId == companyId));
                return await season;
            }
            catch
            {
                var season = new Season();
                return season;
            }
        }

        public int GetSeason(int companyId, string seasonDescription)
        {
            try
            {
                var season =
                    context
                        .Set<Season>()
                        .FirstOrDefault(n =>
                            (n.Description == seasonDescription) &&
                            (n.CompanyId == companyId));

                return season.SeasonId;
            }
            catch
            {
                return 0;
            }
        }

        public IQueryable<Season> GetSeasons(int companyId)
        {
            var q =
                from s in context.Set<Season>()
                where s.CompanyId == companyId
                orderby s.FromDate ascending
                select s;

            //List<Season> seasons = q.ToList();
            return q;
        }

        // public List<SeasonCount> GetSeasonCounts(int seasonId)
        // {
        //     var connection = context.Database.Connection;
        //     try
        //     {
        //         var sSQL = " EXEC SeasonCounts @SeasonID = " + seasonId.ToString();
        //         var result = context.Database.SqlQuery<SeasonCount>("EXEC SeasonCounts @SeasonID",
        //             new SqlParameter("SeasonID", seasonId.ToString())
        //             );
        //         return result.ToList<SeasonCount>();
        //     }
        //     catch (Exception ex)
        //     {
        //         throw new Exception(ex.Message);
        //     }
        // }
        

        public IQueryable<Hoops.Core.ViewModels.SeasonCount> GetSeasonCountsSimple(int seasonId)
        {
            var result =
                (
                from s in context.Set<Season>()
                from d in context.Set<Division>()
                from p in context.Set<Player>()
                where s.SeasonId == d.SeasonId
                where d.DivisionId == p.DivisionId
                where s.SeasonId == seasonId
                group p.PlayerId by new { p.DivisionId, d.DivisionDescription }
                into
                totals
                select
                new { Div_Desc = totals.Key.DivisionDescription, Total = totals.Count() }
                )
                    .ToList()
                    .Select(x =>
                        new Hoops.Core.ViewModels.SeasonCount
                        {
                            Div_Desc = x.Div_Desc,
                            Total = x.Total
                        })
                    .AsQueryable();
            return result;
        }

        
    }
}
