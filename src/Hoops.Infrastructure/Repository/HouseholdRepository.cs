using Microsoft.EntityFrameworkCore;
using Hoops.Infrastructure.Data;
using Hoops.Core.Interface;
using System.Data;
using System.Linq.Expressions;
using Hoops.Core.Models;

namespace Hoops.Infrastructure.Repository
{

    public class HouseholdRepository : EFRepository<Household>, IHouseholdRepository
	{
        public HouseholdRepository(hoopsContext context) : base(context){}

		public IQueryable<Household> GetRecords(int CompanyId = 1, string name = "", string address = "", string phone = "", string email = "")
		{
			var result = from h in context.Set<Household>()
						 where h.CompanyId == CompanyId
						 select h;
			if (!String.IsNullOrEmpty(name))
				result = from h in result
					where h.Name.StartsWith(name)
					orderby h.Name
					select h;
			if (!String.IsNullOrEmpty(address))
				result = from h in result
						 where h.Address1.Contains(address)
						 orderby h.Address1
						 select h;
			if (!String.IsNullOrEmpty(phone))
				result = from h in result
					where h.Phone.Contains(phone) 
					orderby h.Phone
						 select h;
			if (!String.IsNullOrEmpty(email))
				result = from h in result
						 where h.Email.Contains(email)
						 orderby  h.Email
						 select h;
			return result;
		}


		private int dbIntField(int defautValue, int FieldValue = -1)
		{
			int functionReturnValue = 0;
			if (FieldValue == -1)
			{
				functionReturnValue = defautValue;
			}
			else
			{
				functionReturnValue = FieldValue;
			}
			return functionReturnValue;
		}


		public DataTable LoadEmails(int iGroupType, object p2, object p3)
		{
			throw new NotImplementedException();
		}
		#region IRepository<T> Members

		public override Household Insert(Household entity)
		{
            if (entity.HouseId == 0)
            {
                entity.HouseId = context.Set<Household>().Any() ? (context.Set<Household>().Max(p => p.HouseId) + 1) : 1;
            }
			context.Set<Household>().Add(entity);
			var no = context.SaveChanges();
			return entity;
		}

		// public void Delete(Household entity)
		// {
        //     context.Set<Household>().Remove(entity);
        //     context.SaveChanges();
		// }

		public IQueryable<Household> SearchFor(Expression<Func<Household, bool>> predicate)
		{
			return DbSet.Where(predicate);
		}

		// public IQueryable<Household> GetAll()
		// {
        //     return context.Set<Household>().Select(s => s); ;
		// }

		public IQueryable<Household> GetAll(int companyId)
		{
            return context.Set<Household>().Where(s => s.CompanyId == companyId); ;
		}

		// public Household GetById(int id)
		// {
        //     return context.Set<Household>().Find(id);
		// }

		#endregion

		public IQueryable<Household> GetByName(string name)
		{
            var house = context.Set<Household>().Where(h => h.Name.ToUpper() == name.ToUpper());
			return house;
		}


		public override Household Update(Household entity)
		{
			var household = GetById(entity.HouseId);
		    context.Entry(household).State = EntityState.Modified;
			context.SaveChanges();
            return household;
        }    

	}
}
