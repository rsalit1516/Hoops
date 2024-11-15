using System.Collections.Generic;
using System.Threading.Tasks;

namespace Hoops.Core.Interface
{
    public interface IRepository<T> where T : class
    {
        T Insert(T entity);abstract
        Task<T> InsertAsync(T entity);
        void Delete(T entity);
        Task DeleteAsync(int id);
        //IQueryable<T> SearchFor(Expression<Func<T, bool>> predicate);
        IEnumerable<T> GetAll();
        Task<IEnumerable<T>> GetAllAsync();
        T GetById(int id);
        Task<T> FindByAsync(int id);
        T Update(T entity);
        void SaveChanges();
        Task SaveChangesAsync();
    }

}
