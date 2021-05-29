using System;
using System.Linq;
// using Hoops.Infrastructure.Interface;
// using Microsoft.EntityFrameworkCore;
using Csbc.Infrastructure.Interface;
// using System.Collections.Generic;
using System.Collections.Generic;

using System.Linq.Expressions;
using Csbc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Hoops.Infrastructure.Interface;
using System.Threading.Tasks;
using Hoops.Core.Models;
using Hoops.Core;

namespace Hoops.Infrastructure.Repository
{
    //Changes are being saved in this repository. Eventually, if we move to a Unit of Work model, we will remove and put the 
    //login in the UOM calls

    public abstract class EFRepository<T> : IRepository<T> where T : class
    {
        protected hoopsContext context;
        protected DbSet<T> DbSet { get; set; }

        public EFRepository(hoopsContext context)
        {
            this.context = context;
            DbSet = context.Set<T>();
        }

        public virtual IEnumerable<T> GetAll()
        {
            return context.Set<T>().AsQueryable().ToList();
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            return await DbSet.AsQueryable().ToListAsync();
        }

        public virtual T GetById(int id)
        {
            return DbSet.Find(id);
        }
        public virtual async Task<T> FindByAsync(int id)
        {
            return await DbSet.FindAsync(id);
        }
        public virtual T Insert(T entity)
        {
            return context
                .Add(entity)
                .Entity;
        }
        public virtual async Task<T> InsertAsync(T entity)
        {
            var t = await context
                .AddAsync(entity);
            return t.Entity;

        }

        public virtual T Update(T entity)
        {
            return context.Update(entity)
                .Entity;
        }

        public virtual void Delete(T entity)
        {
            var dbEntityEntry = context.Entry(entity);
            if (dbEntityEntry.State != EntityState.Detached)
            {
                dbEntityEntry.State = EntityState.Deleted;

            }
            else
            {
                DbSet.Attach(entity);
                DbSet.Remove(entity);
            }
        }

        public virtual async Task DeleteAsync(int id)
        {
            var entity = await DbSet.FindAsync(id);
            DbSet.Remove(entity);
            await SaveChangesAsync();
        }

        public virtual void Delete(int id)
        {
            var entity = GetById(id);
            if (entity == null) return;
            Delete(entity);
        }

        public void SaveChanges()
        {
            context.SaveChanges();
        }
        public async Task SaveChangesAsync()
        {
            await context.SaveChangesAsync();
        }

    }
}
