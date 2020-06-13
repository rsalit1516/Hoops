using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class SchExceptions
    {
        public int ScheduleNumber { get; set; }
        public int ExceptionNumber { get; set; }
        public DateTime ExceptionDate { get; set; }
        public DateTime ExceptionTime { get; set; }
        public bool ExceptionTimeAllDay { get; set; }
        public int LocationNumber { get; set; }
        public string AddOrRemove { get; set; }
    }
}
