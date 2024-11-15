using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Hoops.Core.ViewModels
{
    public class PlayoffGameVm
    {
        public int ScheduleNumber { get; set; }

        public int GameNumber { get; set; }
        public Nullable<int> LocationNumber { get; set; }
        public Nullable<System.DateTime> GameDate { get; set; }
        public string GameTime { get; set; }
        public string VisitingTeam { get; set; }
        public string HomeTeam { get; set; }
        public string Descr { get; set; }
        public Nullable<int> VisitingTeamScore { get; set; }
        public Nullable<int> HomeTeamScore { get; set; }
        public int DivisionId { get; set; }
        public string LocationName { get; set; }
        // public int? SchedulePlayoffId { get; set; }
    }
}

