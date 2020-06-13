using Hoops.Core.Entities;

namespace Hoops.Infrastructure.Interface
{
    public interface IScheduleGameService
    {
        bool CreateScheduleGame(ScheduleGame scheduleGameToCreate);
    }
}
