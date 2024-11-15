using Hoops.Core.Models;

namespace Hoops.Infrastructure.Interface
{
    public interface IScheduleGameService
    {
        bool CreateScheduleGame(ScheduleGame scheduleGameToCreate);
    }
}
