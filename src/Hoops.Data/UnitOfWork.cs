using Hoops.Core.Models;
using Hoops.Core.Interface;
using Hoops.Infrastructure.Repository;
using Hoops.Infrastructure.Data;

namespace Hoops.Core.Infrastructure
{
    public interface IUnitofWork
    {
        IRepository<Season> SeasonRepository { get; }
        void SaveChanges();
    }
    public class UnitOfWork : IUnitofWork
    {
        private hoopsContext context;
        private IRepository<Season> seasonRepository;

        public UnitOfWork(hoopsContext context)
        {
            this.context = context;
            seasonRepository = new SeasonRepository(context);
        }

        public IRepository<Season> SeasonRepository
        {
            get
            {
                if (seasonRepository == null)
                {
                    // seasonRepository = new SeasonRepository(context);
                }
                return seasonRepository;
            }
        }

        public void SaveChanges()
        {
            context.SaveChanges();
        }
    }
}
