#nullable enable

namespace Hoops.Core.ViewModels;

public class ScheduleStandingsVM
{
    public int TeamNo { get; set; }
    public string? TeamName { get; set; }
    public string? ScheduleName { get; set; }
    public string? DivNo { get; set; }
    public string? Team { get; set; }
    public int Won { get; set; }
    public int Lost { get; set; }
    public decimal Pct { get; set; }
    public int Tiebreaker { get; set; }
    public int Streak { get; set; }
    public int PF { get; set; }
    public int PA { get; set; }
    public decimal GB { get; set; }
}
