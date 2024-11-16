using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hoops.Core.Models
{
    public partial class ScheduleGame
    {
        [Key]
        public int ScheduleGamesId { get; set; }
        public int ScheduleNumber { get; set; }
        public int GameNumber { get; set; }
        public int? LocationNumber { get; set; }
        public DateTime GameDate { get; set; }
        public string GameTime { get; set; }
        public int? VisitingTeamNumber { get; set; }
        public int? HomeTeamNumber { get; set; }
        public int? VisitingTeamScore { get; set; }
        public int? HomeTeamScore { get; set; }
        public bool? VisitingForfeited { get; set; }
        public bool? HomeForfeited { get; set; }
        public int? SeasonId { get; set; }
        public int? DivisionId { get; set; }
        
    }
}
