using System;
using System.Collections.Generic;
using System.Linq;
using Hoops.Core.ViewModels;

namespace Hoops.Core.Scheduling
{
    public class GameTimeSlotManager
    {
        private readonly List<AvailableTimeSlot> _slots;
        private readonly Dictionary<(DateTime date, int location), HashSet<TimeSpan>> _claimed = new();

        public GameTimeSlotManager(IEnumerable<AvailableTimeSlot> timeSlots)
        {
            _slots = timeSlots.ToList();
        }

        /// <summary>
        /// Returns distinct location IDs that have at least one configured slot for a given division and day.
        /// </summary>
        public IEnumerable<int> GetLocationsForDivisionAndDay(int divisionId, DayOfWeek day)
            => _slots
                .Where(s => s.DivisionId == divisionId && s.DayOfWeek == day)
                .Select(s => s.LocationId)
                .Distinct();

        /// <summary>
        /// Claims the next unclaimed start time for a division/date/location combination.
        /// Returns null if no time is available (all slots claimed or none configured).
        /// Court occupancy is shared across divisions — two divisions cannot claim the same court at the same time.
        /// </summary>
        public TimeSpan? ClaimNextSlot(int divisionId, DateTime date, int locationId)
        {
            var times = _slots
                .Where(s => s.DivisionId == divisionId && s.DayOfWeek == date.DayOfWeek && s.LocationId == locationId)
                .Select(s => s.StartTime)
                .OrderBy(t => t)
                .ToList();

            if (times.Count == 0) return null;

            var key = (date.Date, locationId);
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
