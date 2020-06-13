using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class SchGameTimes
    {
        public int ScheduleNumber { get; set; }
        public int TeamNumber { get; set; }
        public int LocationNumber { get; set; }
        public byte WeekDay { get; set; }
        public DateTime GameStartTime { get; set; }
        public short MilitaryTime { get; set; }
    }
}
