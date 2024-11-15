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
        public Nullable<int> LocationNumber { get; set; }
        public DateTime GameDate { get; set; }
        public string GameTime { get; set; }
        public Nullable<int> VisitingTeamNumber { get; set; }
        public Nullable<int> HomeTeamNumber { get; set; }
        public Nullable<int> VisitingTeamScore { get; set; }
        public Nullable<int> HomeTeamScore { get; set; }
        public Nullable<bool> VisitingForfeited { get; set; }
        public Nullable<bool> HomeForfeited { get; set; }
        public int? SeasonId { get; set; }
        public int? DivisionId { get; set; }
        
    }
}
