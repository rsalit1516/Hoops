using System;
using System.Collections.Generic;

namespace Hoops.Core.Models
{
    public partial class vw_Games
    {
        public string GameType { get; set; }
        public DateTime? GameDate { get; set; }
        public int? ScheduleNumber { get; set; }
        public int? GameNumber { get; set; }
        public string Division { get; set; }
        public string GameDateTime { get; set; }
        public string GameTime { get; set; }
        public string HomeTeam { get; set; }
        public string VisitorTeam { get; set; }
        public string LocationName { get; set; }
        public int? LocationNumber { get; set; }
        public string Descr { get; set; }
    }
}
