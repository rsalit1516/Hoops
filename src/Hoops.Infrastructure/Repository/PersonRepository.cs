using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Hoops.Core.Models;
using Hoops.Core.Interface;
using Hoops.Core.Enum;
using Hoops.Core;

namespace Hoops.Infrastructure.Repository
{
    public class PersonRepository : EFRepository<Person>, IPersonRepository
    {

        public PersonRepository(hoopsContext context) : base(context) {}

        #region IRepository<T> Members

        public IQueryable<Person> SearchFor(Expression<Func<Person, bool>> predicate)
        {
            return DbSet.Where(predicate);
        }

        public List<Person> GetAll(int companyId)
        {
            var people = context.Set<Person>().Where<Person>(p => p.CompanyId == companyId).ToList<Person>();
            return people;
        }
        public List<Person> GetPlayers(int companyId)
        {
            var people = context.Set<Person>().Where<Person>(p => p.CompanyId == companyId && p.Player == true).ToList<Person>();
            return people;
        }


        #endregion

        // public Person Insert(Person entity)
        // {
        //     if (entity.PeopleID == 0)
        //     {
        //         //entity.PeopleID = Datacontext.People.Any() ? (Datacontext.People.Max(p => p.PersonId) + 1) : 1;
        //     }
        //     context.Set<Person>().Add(entity);
        //     var no = context.SaveChanges();
        //     no = entity.PersonId;
        //     return entity;
        // }
        // public void Update(Person entity)
        // {
        //     try
        //     {
        //         var person = GetById(entity.PersonId);
        //         person = entity;
        //         context.SaveChanges();
        //     }
        //     catch (Exception ex)
        //     {
        //         { }
        //         throw;
        //     }
        // }

        public bool CanDelete(int personId)
        {
            var playerRep = new PlayerRepository(context);
            var wasPlayer = playerRep.WasPlayer(personId);
            return !wasPlayer; //can't delete if person has a plyer record
        }
        public override void Delete(Person entity)
        {
            if (CanDelete(entity.PersonId))
                context.Set<Person>().Remove(entity);
        }

        public int FindPersonByLastName(string name)
        {
            int id = 0;
            var person = context.Set<Person>().FirstOrDefault(n => n.LastName == name);
            id = person.PersonId;

            return id;
        }
        public Person FindPersonByLastAndFirstName(string lastName, string firstName)
        {
            var person = context.Set<Person>().FirstOrDefault(n => n.LastName == lastName && n.FirstName == firstName);
            return person;
        }
        public IQueryable<Person> FindPeopleByLastAndFirstName(string lastName, string firstName, bool playerOnly)
        {
            IQueryable<Person> person = null;
            if (!String.IsNullOrEmpty(lastName) && (!String.IsNullOrEmpty(firstName)))
            {
                person = context.Set<Person>().Where(n => n.LastName.StartsWith(lastName) && n.FirstName.StartsWith(firstName));
            }
            else if (!String.IsNullOrEmpty(lastName) && (String.IsNullOrEmpty(firstName)))
            {
                person = context.Set<Person>().Where(n => n.LastName.StartsWith(lastName));
            }
            if (String.IsNullOrEmpty(lastName) && (!String.IsNullOrEmpty(firstName)))
            {
                person = context.Set<Person>().Where(n => n.FirstName.StartsWith(firstName));
            }
            if (person != null)
            {
                if (playerOnly)
                {
                    return person.Where(p => p.Player == true).OrderBy(p => p.LastName).ThenBy(e => e.FirstName);
                }
                else
                {
                    return person.OrderBy(p => p.LastName).ThenBy(e => e.FirstName);
                }

            }
            else
            {
                return person;
            }
        }

        public int FindByEmail(string email)
        {
            int id = 0;
            var person = context.Set<Person>().FirstOrDefault(n => n.Email == email);
            if (person != null)
                id = person.PersonId;
            return (id);
        }

        public IQueryable<Person> GetByGroup(int companyId, int seasonId, GroupTypes.GroupType group)
        {
            var people = context.Set<Person>()
                .Where(p => p.CompanyId == companyId);
            switch (group)
            {
                case GroupTypes.GroupType.BoardMember:
                    people = people.Where(p => p.BoardMember == true);
                    break;
                case GroupTypes.GroupType.CoachesSponsors:
                    people = people.Where(p => p.Coach == true || p.Sponsor == true);
                    break;
                case GroupTypes.GroupType.SeasonPlayers:
                    people = people
                        .Join(context.Set<Player>(), p => p.PersonId, l => l.PersonId, (p, l) => new { p, l })
                        .Where(x => x.l.SeasonId == seasonId)
                        .Select(x => x.p) ;
                    break;
                default :
                    break;
            }
            return people;
        }

        
        public int GetBccList( string lastName, string firstName)
        {
            int id = 0;
            //Get test community
            //List<Person> people = context.People.Select.First(n => n.LastName == lastName && n.FirstName == firstName);
            //id = person.PersonID;
            return id;
        }

        public bool DeleteById(int id)
        {
            bool tflag = false;

            var person = context.Set<Person>().Find(id);
            if (person != null)
            {
                context.Set<Person>().Remove(person);
                context.SaveChanges();
                tflag = true;
            }
            return tflag;
        }

        //public List<Person> GetBoardMembers(int companyId)
        //{
        //    return new List<Person>();
        //}

        public IQueryable<Person> GetADs(int companyId)
        {
            var people = context.Set<Person>().Where(p => p.CompanyId == companyId)
                                .Where(p => p.Ad == true);
            return people;
        }

        public void RemoveFromHousehold(int p)
        {
            var person = context.Set<Person>().Find(p);
            // person.HouseId = 0;
            context.SaveChanges();

        }

        public IQueryable<Person> GetByHousehold(int houseId)
        {
            return context.Set<Person>().Where(p => p.HouseId == houseId);
        }

        public List<string> GetParents(int personId)
        {
            var child = context.Set<Person>().Find(personId);
            var parents = context.Set<Person>()
                            .Where(p => p.HouseId == (child.HouseId) && (p.Parent == true))
                            .Select(person => person.LastName + ", " + person.FirstName).ToList();
            return parents;
            
        }
    }
}