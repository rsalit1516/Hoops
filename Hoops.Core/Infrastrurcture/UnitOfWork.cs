using Hoops.Core.Models;
using Hoops.Infrastructure.Interface;

namespace Hoops.Core.Infrastructure
{
    public interface IUnitofWork
    {
        IRepository<Season> SeasonRepository { get; }
        void SaveChanges();
    }
    public class UnitOfWork: IUnitofWork
    {
        private hoopsContext context;

        public UnitOfWork(hoopsContext context)
        {
            this.context = context;
        }

        private IRepository<Season> seasonRepository;
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
