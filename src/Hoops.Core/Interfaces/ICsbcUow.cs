namespace Hoops.Infrastructure.Interface
{
    public interface ICsbcUow
    {
        // Save pending changes to the data store.
        void Commit();

        // IScheduleGameRepository ScheduleGames { get; }
        // IColorRepository Colors { get; }
        // IHouseholdRepository Households { get; }
        // // Repository
        // IPersonRepository People { get; }
        //IRepository<Room> Rooms { get; }
        //ISessionsRepository Sessions { get; }
        //IRepository<TimeSlot> TimeSlots { get; }
        //IRepository<Track> Tracks { get; }
        //IAttendanceRepository Attendance { get; }
    }
}
