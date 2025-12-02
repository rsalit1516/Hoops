using System.Collections.Generic;
using System.Threading.Tasks;

namespace Hoops.Core.Interface
{
    public interface IRepository<T> where T : class
    {
        T Insert(T entity);
        Task<T> InsertAsync(T entity);
        void Delete(T entity);
        Task DeleteAsync(int id);
        IEnumerable<T> GetAll();
        Task<IEnumerable<T>> GetAllAsync();
        T GetById(int id);
        Task<T> GetByIdAsync(int id);
        Task<T> FindByAsync(int id);
        T Update(T entity);
        Task<bool> UpdateAsync(T entity);
        void SaveChanges();
        Task SaveChangesAsync();
    }

}
