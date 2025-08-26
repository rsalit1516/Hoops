namespace Hoops.Functions.Models
{
    public class UpdateGameScoresDto
    {
        public int ScheduleGamesId { get; set; }
        public int? HomeTeamScore { get; set; }
        public int? VisitingTeamScore { get; set; }
        public bool? HomeForfeited { get; set; }
        public bool? VisitingForfeited { get; set; }
    }
}
