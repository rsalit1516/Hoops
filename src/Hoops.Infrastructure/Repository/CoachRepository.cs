using System.Data;
using Hoops.Core.Interface;
using Hoops.Core.Models;
using Hoops.Infrastructure.Data;


namespace Hoops.Infrastructure.Repository
{
    public class CoachRepository : EFRepository<Coach>, ICoachRepository
    {
        public CoachRepository(hoopsContext context) : base(context) { }
      
        public  IQueryable<VwCoach> GetSeasonCoaches(int seasonId)
        {           
            List<VwCoach> vwCoach = new List<VwCoach>();
            foreach (var coach in context.Set<Coach>().Where(c => c.SeasonId == seasonId).ToList<Coach>())
            {
                var vwPlayer = new VwCoach(); 
                vwPlayer.PersonId = coach.PersonId;
                if (coach.Person != null)
                    vwPlayer.Name = coach.Person.LastName + ", " + coach.Person.FirstName;
                vwPlayer.CoachPhone = coach.CoachPhone;
                vwPlayer.ShirtSize = coach.ShirtSize;
                vwPlayer.CoachId = coach.CoachId;
                vwCoach.Add(vwPlayer);
            }
            var vwCoaches = vwCoach.AsQueryable<VwCoach>().OrderBy(c => c.Name);
            return vwCoaches;
        }

        // public DataTable GetCoaches(int seasonId)
        // {
        //     var cn = new SqlConnection((context as hoopsContext).CSDBConnectionString);
        //     cn.Open();
        //     var sSQL = "EXEC GetCoaches ";
        //     sSQL += "@SeasonID = " + seasonId;
        //     var myAdapter = new SqlDataAdapter(sSQL, cn);
        //     var dtResults = new DataTable();
        //     myAdapter.Fill(dtResults);
        //     myAdapter.Dispose();
        //     return dtResults;
        // }
        public VwCoach GetCoach(int id)
        {
            var coach = context.Set<Coach>().Find(id);

            VwCoach vw = new VwCoach();
            vw.CompanyId = (int)coach.CompanyId;
            vw.SeasonId = coach.SeasonId;
            vw.CoachId = coach.CoachId;
            vw.Name = (coach.Person.FirstName + " " + coach.Person.LastName);
            // vw.Housephone = coach.Person.Household.Phone; To Do: link Household to Person
            vw.Cellphone = coach.Person.Cellphone;
            vw.ShirtSize = coach.ShirtSize;
            vw.PersonId = coach.PersonId;
            // vw.Address1 = coach.Person.Household.Address1;
            // vw.City = coach.Person.Household.City;
            // vw.State = coach.Person.Household.State;
            // vw.Zip = coach.Person.Household.Zip;
            vw.CoachPhone = coach.CoachPhone;     
           
            return vw;

        }
        public Coach GetCoachForSeason(int seasonId, int peopleId)
        {
            return context.Set<Coach>().FirstOrDefault(c => c.SeasonId == seasonId && c.PersonId == peopleId);
        }

        public bool DeleteById(int id)
        {
            bool tflag = false;

            var coach = context.Set<Coach>().Find(id);
            if (coach != null)
            {
                context.Set<Coach>().Remove(coach);
                context.SaveChanges();
                tflag = true;
            }
            return tflag;
        }
        public IQueryable<VwCoach> GetCoachVolunteers(int companyId, int seasonId)
        {          
            var coaches = from p in context.Set<Person>()
                                where p.Coach == true
                                orderby p.LastName, p.FirstName
                                select new
                                {
                                    p.PersonId,
                                    p.LastName,
                                    p.FirstName
                                };

            IQueryable<VwCoach> vwCoaches = coaches.Cast<VwCoach>();

            var count = coaches.Count();
            var currentCoaches = GetSeasonCoaches(seasonId);
            List<VwCoach> vwCoach = new List<VwCoach>();
            foreach (var player in coaches)
            {
                if (!currentCoaches.Any<VwCoach>(p => p.PersonId == player.PersonId))
                {
                var vwPlayer = new VwCoach();
  
                vwPlayer.PersonId = player.PersonId;
                vwPlayer.Name = player.LastName + ", " + player.FirstName;
                //vwPlayer.CoachPhone = player.
                vwCoach.Add(vwPlayer);
                }
            }
            vwCoaches = vwCoach.AsQueryable<VwCoach>();
            return vwCoaches;
        }

        
    }
}

