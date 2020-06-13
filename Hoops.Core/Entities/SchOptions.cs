using System;
using System.Collections.Generic;

namespace Hoops.Core.Entities
{
    public partial class SchOptions
    {
        public int? ScheduleNumber { get; set; }
        public byte ScheduleOption { get; set; }
        public byte ComputeOption { get; set; }
        public byte DisplaceOption { get; set; }
        public short TimesInsideDivision { get; set; }
        public short TimesOutsideDivision { get; set; }
        public byte DivisionOption { get; set; }
        public DateTime EndDate { get; set; }
        public short GamesPerTeam { get; set; }
        public short MaxGamesDay { get; set; }
        public short MaxGamesWeek { get; set; }
        public short MinDaysBetweenGames { get; set; }
        public byte ComputeMethod { get; set; }
        public bool CheckForGameConflicts { get; set; }
        public bool CheckAllSchedules { get; set; }
    }
}
