using Hoops.Core.Models;

namespace Hoops.Core.Interface
{
    public interface IScheduleGameService
    {
        bool CreateScheduleGame(ScheduleGame scheduleGameToCreate);
    }
}
