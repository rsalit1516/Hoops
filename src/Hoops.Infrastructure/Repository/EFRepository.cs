using Microsoft.EntityFrameworkCore;
using Hoops.Core.Interface;
using Hoops.Infrastructure.Data;

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
        // public EFRepository()
        // {
        //     this.context = new hoopsContext();
        //     DbSet = context.Set<T>();
        // }

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
            return DbSet.Find(id)!;
        }
        public virtual async Task<T> FindByAsync(int id)
        {
            var entity = await DbSet.FindAsync(id);
            return entity ?? throw new InvalidOperationException("Entity not found");
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
                if (entity != null)
                {
                    if (entity != null)
                    {
                        DbSet.Remove(entity);
                    }
                }
            }
        }

        public virtual async Task DeleteAsync(int id)
        {
            var entity = await DbSet.FindAsync(id);
            if (entity != null)
            {
                _ = DbSet.Remove(entity);
            }
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
