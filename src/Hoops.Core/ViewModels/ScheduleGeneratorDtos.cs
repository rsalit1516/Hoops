using System;
using System.Collections.Generic;

namespace Hoops.Core.ViewModels
{
    public class ScheduleGeneratorRequest
    {
        public int SeasonId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public List<int> DivisionIds { get; set; } = new();
        public int GamesPerTeam { get; set; } = 10;
        public int MaxGamesPerWeekPerTeam { get; set; } = 2;
        public int GameDurationMinutes { get; set; } = 50;
        public List<AvailableTimeSlot> TimeSlots { get; set; } = new();
        public List<ScheduleBlackoutDate> BlackoutDates { get; set; } = new();
        public bool EnforceCoachConflicts { get; set; } = true;
    }

    public class AvailableTimeSlot
    {
        public int DivisionId { get; set; }
        public DayOfWeek DayOfWeek { get; set; }
        public TimeSpan StartTime { get; set; }
        public int LocationId { get; set; }
    }

    public class ScheduleBlackoutDate
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int? LocationId { get; set; }
    }

    public class ScheduleGeneratorResult
    {
        public bool Success { get; set; }
        public string? ErrorMessage { get; set; }
        public List<ScheduleGamePreviewItem> Games { get; set; } = new();
        public int TotalGames => Games.Count;
    }

    public class ScheduleGamePreviewItem
    {
        public int DivisionId { get; set; }
        public string DivisionName { get; set; } = string.Empty;
        public int ScheduleNumber { get; set; }
        public int GameNumber { get; set; }
        public DateTime GameDate { get; set; }
        public string GameTime { get; set; } = string.Empty;
        public int LocationNumber { get; set; }
        public string LocationName { get; set; } = string.Empty;
        public int HomeTeamId { get; set; }
        public string HomeTeamName { get; set; } = string.Empty;
        public int VisitingTeamId { get; set; }
        public string VisitingTeamName { get; set; } = string.Empty;
        public List<string> Warnings { get; set; } = new();
    }

    public class ScheduleCommitRequest
    {
        public int SeasonId { get; set; }
        public List<ScheduleGamePreviewItem> Games { get; set; } = new();
    }

    public class ScheduleCommitResult
    {
        public int GamesCreated { get; set; }
        public List<string> Errors { get; set; } = new();
    }
}
