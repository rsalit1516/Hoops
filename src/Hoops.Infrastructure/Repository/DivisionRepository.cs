using System.Linq.Expressions;
using System.Data;
using Hoops.Core.Interface;
using Microsoft.EntityFrameworkCore;
using Hoops.Core.Models;
using Hoops.Infrastructure.Data;

namespace Hoops.Infrastructure.Repository
{
    public class DivisionRepository(hoopsContext context) : EFRepository<Division>(context), IDivisionRepository
    {
        private readonly ILogger<DivisionRepository>? _logger;

        public IQueryable<VwDivision> LoadDivisions(int seasonId)
        {
            try
            {

                var divisions = from d in context.Set<Division>()
                                where d.SeasonId == seasonId
                                orderby d.Gender descending, d.MinDate descending
                                select new
                                {
                                    d.DivisionId,
                                    d.DivisionDescription,
                                    d.Gender,
                                    d.MinDate,
                                    d.MaxDate,
                                    d.Gender2,
                                    d.MinDate2,
                                    d.MaxDate2,
                                    d.DraftVenue,
                                    d.DraftDate,
                                    d.DraftTime,
                                    d.DirectorId,
                                };
                IQueryable<VwDivision> vwDiv = divisions.Cast<VwDivision>(); ;

                var count = divisions.Count();
                var repTeam = new TeamRepository(context);
                List<VwDivision> vwDivisions = new List<VwDivision>();
                foreach (var division in divisions)
                {
                    var div = new VwDivision();
                    div.DivisionId = division.DivisionId;
                    div.DivDesc = division.DivisionDescription;
                    div.Gender = division.Gender;
                    div.MinDate = division.MinDate;
                    div.MaxDate = division.MaxDate;
                    div.Gender2 = division.Gender2;
                    div.MinDate2 = division.MinDate2;
                    div.MaxDate2 = division.MaxDate2;
                    div.DraftVenue = division.DraftVenue;
                    div.DraftDate = division.DraftDate;
                    div.DraftTime = division.DraftTime;
                    div.DirectorId = division.DirectorId;
                    vwDivisions.Add(div);
                }

                vwDiv = vwDivisions.AsQueryable<VwDivision>();
                return vwDiv;
            }
            catch (Exception ex)
            {
                throw new Exception("ClsDivisions:LoadDivision::" + ex.Message);
            }
        }

        public IQueryable<Division> GetAD(int seasonId, int peopleId)
        {
            return context.Set<Division>().Where(d => d.SeasonId == seasonId && d.DirectorId == peopleId);
        }

        public IQueryable<Division> GetDivisions(int seasonId)
        {
            var divisions = context.Set<Division>().Where(h => h.SeasonId == seasonId).OrderByDescending(d => d.MinDate);
            return divisions;
        }

        public async Task<IEnumerable<Division>> GetSeasonDivisionsAsync(int seasonId) =>
        await context.Divisions
            .Where(h => h.SeasonId == seasonId)
            .OrderByDescending(d => d.MinDate)
            .ToListAsync();


        //public int GetPlayerDivision(int companyId, int seasonId, int peopleId)
        //{
        //    int retval = 0;
        //    var db = new hoopsContext();
        //    var cn = new SqlConnection(db.CSDBConnectionString);
        //    var sSQL = "exec GetDivision ";
        //        sSQL += " @iSeason = " + seasonId.ToString();
        //        sSQL += ", @iPeopleID = " + peopleId.ToString();
        //    var myAdapter = new SqlDataAdapter(sSQL, cn);
        //    var dtResults = new DataTable();
        //    try
        //    {
        //        cn.Open();
        //        myAdapter.Fill(dtResults);
        //        myAdapter.Dispose();

        //        var row = dtResults.Rows[0];
        //        var item = row.ItemArray[0];
        //        retval = Convert.ToInt32(item);
        //    }
        //    catch
        //    {
        //        retval = 0;
        //    }
        //    finally
        //    {
        //        dtResults.Dispose();
        //        cn.Close();
        //    }
        //    return retval;
        //}
        public int GetPlayerDivision(int companyId, int seasonId, int peopleId)
        {
            ILogger<PersonRepository> _logger = LoggerFactory.Create(builder => builder.AddConsole()).CreateLogger<PersonRepository>();
            var personRepo = new PersonRepository(context, _logger);
            var person = personRepo.GetById(peopleId);
            var seasonDivisions = GetDivisions(seasonId);
            var division = seasonDivisions
                .FirstOrDefault(GetPlayerDivisionPredicate(person, (DateTime?)person.BirthDate ?? DateTime.MinValue));

            var playerRepo = new PlayerRepository(context);
            var player = playerRepo.GetPlayerByPersonAndSeasonId(peopleId, seasonId);
            if (player != null && player.PlaysDown == true)
            {
                var divisionDown = seasonDivisions
                                .FirstOrDefault(GetPlayerDivisionPredicate(person, (DateTime)(person.BirthDate?.AddYears(1) ?? DateTime.MinValue)));
                if (divisionDown == division)
                {
                    divisionDown = seasonDivisions
                                .FirstOrDefault(GetPlayerDivisionPredicate(person, (DateTime)(person.BirthDate?.AddYears(2) ?? DateTime.MinValue)));
                }
                if (divisionDown != null)
                    division = divisionDown;
            }

            if (person.GiftedLevelsUp == 1)
            {
                var divisionUp = seasonDivisions
                               .FirstOrDefault(GetPlayerDivisionPredicate(person, (DateTime)(person.BirthDate?.AddYears(-1) ?? DateTime.MinValue)));
                if (divisionUp == division && person.Gender == "F")
                {
                    divisionUp = seasonDivisions
                                .FirstOrDefault(GetPlayerDivisionPredicate(person, (DateTime)(person.BirthDate?.AddYears(-2) ?? DateTime.MinValue)));
                }
                if (divisionUp != null)
                    division = divisionUp;
            }
            if (division == null)
            {
                throw new Exception("Division not found for the given criteria.");
            }
            return division.DivisionId;
        }

        private static Expression<Func<Division, bool>> GetPlayerDivisionPredicate(Person person, DateTime birthDate)
        {
            return d => (d.Gender == person.Gender && (d.MinDate <= birthDate && d.MaxDate >= birthDate))
                            || (d.Gender2 == person.Gender && (d.MinDate <= birthDate && d.MaxDate >= birthDate));
        }
    }
}
