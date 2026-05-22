using System;
using System.Collections.Generic;
using System.Linq;
using Hoops.Core.ViewModels;

namespace Hoops.Core.Scheduling
{
    public class GameTimeSlotManager
    {
        private readonly Dictionary<(DateTime date, int location), HashSet<TimeSpan>> _claimed = new();
        private readonly ILookup<DayOfWeek, (TimeSpan time, int? locationId)> _slotsByDay;

        public GameTimeSlotManager(IEnumerable<AvailableTimeSlot> timeSlots)
        {
            _slotsByDay = timeSlots.ToLookup(
                s => s.DayOfWeek,
                s => (s.StartTime, s.LocationId));
        }

        public static IEnumerable<AvailableTimeSlot> DefaultSlots()
        {
            var weeknightTimes = new[]
            {
                new TimeSpan(18, 0, 0),
                new TimeSpan(18, 50, 0),
                new TimeSpan(19, 40, 0),
                new TimeSpan(20, 30, 0),
            };
            var weekendTimes = new[]
            {
                new TimeSpan(9, 0, 0),
                new TimeSpan(9, 50, 0),
                new TimeSpan(10, 40, 0),
                new TimeSpan(11, 30, 0),
            };

            foreach (var day in new[] { DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday, DayOfWeek.Thursday })
                foreach (var time in weeknightTimes)
                    yield return new AvailableTimeSlot { DayOfWeek = day, StartTime = time };

            foreach (var day in new[] { DayOfWeek.Saturday, DayOfWeek.Sunday })
                foreach (var time in weekendTimes)
                    yield return new AvailableTimeSlot { DayOfWeek = day, StartTime = time };
        }

        public IEnumerable<TimeSpan> GetTimesForDay(DayOfWeek day, int locationNumber)
            => _slotsByDay[day]
                .Where(s => s.locationId == null || s.locationId == locationNumber)
                .Select(s => s.time)
                .OrderBy(t => t);

        public bool HasAvailableSlot(DateTime date, int locationNumber)
        {
            var times = GetTimesForDay(date.DayOfWeek, locationNumber).ToList();
            if (times.Count == 0) return false;

            var key = (date.Date, locationNumber);
            return !_claimed.TryGetValue(key, out var used) || used.Count < times.Count;
        }

        public TimeSpan? ClaimNextSlot(DateTime date, int locationNumber)
        {
            var times = GetTimesForDay(date.DayOfWeek, locationNumber).ToList();
            if (times.Count == 0) return null;

            var key = (date.Date, locationNumber);
            if (!_claimed.TryGetValue(key, out var used))
            {
                used = new HashSet<TimeSpan>();
                _claimed[key] = used;
            }

            var next = times.FirstOrDefault(t => !used.Contains(t));
            if (next == default) return null;

            used.Add(next);
            return next;
        }
    }
}
