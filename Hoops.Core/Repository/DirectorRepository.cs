using System.Collections.Generic;
using System.Linq;
using Hoops.Core.Models;
using Csbc.Infrastructure;
using Hoops.Infrastructure.Interface;
using Hoops.Core;

namespace Hoops.Infrastructure.Repository
{
    public class DirectorRepository : EFRepository<Director>, IDirectorRepository
    {
        public DirectorRepository(hoopsContext context) : base(context) { }

        public override Director Insert(Director entity)
        {
            if (entity.DirectorId == 0)
            {
                entity.DirectorId = context.Set<Director>().Any() ? (context.Set<Director>().Max(p => p.DirectorId) + 1) : 1; 
            }
            if ((entity.Seq == null) || (entity.Seq == 0))
            {
                entity.Seq = context.Set<Director>().Any() ? (context.Set<Director>().Max(c => c.Seq) + 1) : 1;
            }

            context.Set<Director>().Add(entity);
            var no = context.SaveChanges();
            return entity;
        }

        public IQueryable<VwDirector> GetAll(int companyId)
        {
            var directors =
                from p in context.Set<Person>()
                from d in context.Set<Director>()
                from h in context.Set<Household>()
                where p.PersonId == d.PersonId
                where p.HouseId == h.HouseId
                where d.CompanyId == companyId
                select new
                {
                    d.DirectorId,
                    d.Title,
                    p.FirstName,
                    p.LastName,
                    h.Phone,
                    p.Workphone,
                    p.Cellphone,
                    p.Email,
                    h.Address1,
                    h.City,
                    h.State,
                    h.Zip,
                    p.CompanyId

                };
            List<VwDirector> vwDirectors = new List<VwDirector>();
            foreach (var director in directors)
            {
                var dir = new VwDirector();
                dir.DirectorId = director.DirectorId;
                dir.Title = director.Title;
                dir.Name = director.FirstName + " " + director.LastName;
                dir.Phone = director.Phone;
                dir.WorkPhone = director.Workphone;
                dir.CellPhone = director.Cellphone;
                dir.Email = director.Email;
                dir.Address1 = director.Address1;
                dir.City = director.City;
                dir.State = director.State;
                dir.Zip = director.Zip;
                dir.CompanyId = (int)director.CompanyId;

                vwDirectors.Add(dir);
            }

            var vwDir = vwDirectors.AsQueryable<VwDirector>();
            return vwDir;
        }

        public List<VwDirector> GetDirectorVolunteers(int companyId)
        {
            var directors = from p in context.Set<Person>()
                            where p.BoardOfficer == true || p.BoardMember == true
                            orderby p.LastName, p.FirstName
                            select new
                            {
                                p.PersonId,
                                p.LastName,
                                p.FirstName
                            };

            var count = directors.Count();
            List<VwDirector> vwDirectors = new List<VwDirector>();
            foreach (var person in directors)
            {
                var vwDirector = new VwDirector();

                vwDirector.PersonId = person.PersonId;
                vwDirector.Name = person.LastName + ", " + person.FirstName;

                vwDirectors.Add(vwDirector);

            }
            return vwDirectors;
        }
    }
}
