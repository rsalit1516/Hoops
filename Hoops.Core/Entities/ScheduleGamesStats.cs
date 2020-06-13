using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class ScheduleGamesStats
    {
        public int RowId { get; set; }
        public int TeamNumber { get; set; }
        public int ScheduleNumber { get; set; }
        public int GameNumber { get; set; }
        public int SeasonId { get; set; }
        public int PersonId { get; set; }
        public int? Points { get; set; }
        public bool Dnp { get; set; }
    }
}
