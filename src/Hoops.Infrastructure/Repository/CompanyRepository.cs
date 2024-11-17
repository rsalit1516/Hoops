using System.Linq.Expressions;
using Hoops.Core.Interface;
using Hoops.Infrastructure.Data;
using Hoops.Core.Models;

namespace Hoops.Infrastructure.Repository
{
    public class CompanyRepository : EFRepository<Company>, ICompanyRepository
    {
        public CompanyRepository(hoopsContext context) : base(context)
        {
            if (context is null)
            {
                throw new ArgumentNullException(nameof(context));
            }
        }

        #region IRepository<T> Members


        public override void Delete(Company entity)
        {
            DbSet.Remove(entity);
        }

        public IQueryable<Company> SearchFor(Expression<Func<Company, bool>> predicate)
        {
            return DbSet.Where(predicate);
        }

        #endregion

        public override Company Insert(Company entity)
        {
            if (entity.CompanyId == 0)
                entity.CompanyId = context.Set<Company>().Any() ? context.Set<Company>().Max(c => c.CompanyId) + 1 : 1;
            context.Set<Company>().Add(entity);
            var no = context.SaveChanges();
            return entity;
        }

        public int FindCompanyByName(string name)
        {
            int id = 0;
            string companyTableName = context.Set<Company>().ToString();
            var company = context.Set<Company>().FirstOrDefault(n => n.CompanyName == name);
            if (company==null)
                id = 0;
            else
                id = company.CompanyId;

            return id;
        }

        public bool FindByEmail(string email)
        {
            var Company = context.Set<Company>().FirstOrDefault(n => n.EmailSender == email);
            return (Company != null);
        }
   
        public int GetBccList(hoopsContext context, string lastName, string firstName)
        {
            int id = 0;
            //Get test community
            //List<Company> Companies = context.Companies.Select.First(n => n.LastName == lastName && n.FirstName == firstName);
            //id = Company.CompanyId;
            return id;
        }

 
    }
}
