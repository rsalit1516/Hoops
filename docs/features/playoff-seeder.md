# Schedule Playoff Seeder

## Overview

The `SchedulePlayoffSeeder` automatically generates playoff tournament brackets after the regular season games have been scheduled. It creates a standard tournament structure where teams are paired based on their standings (last place vs first place, etc.) and games are scheduled for weekends.

## Features

### Tournament Bracket Generation
- **Quarterfinals**: 8 teams paired as Team 8 vs Team 1, Team 7 vs Team 2, etc.
- **Semifinals**: Winners advance with generic naming (Team A vs Team B, etc.)
- **Championship**: Final game between semifinal winners

### Game Scheduling
- Games are scheduled for weekends (Saturday/Sunday)
- Each round is scheduled for consecutive weekends
- Quarterfinals: First weekend
- Semifinals: Second weekend  
- Championship: Third weekend

### Location Management
- Games are distributed across available locations
- Round-robin assignment ensures even distribution
- Falls back gracefully if no locations are available

## Implementation Details

### Database Integration
The seeder works with both SQL Server (production) and in-memory databases (testing):

```csharp
// Handles different database providers
if (context.Database.ProviderName == "Microsoft.EntityFrameworkCore.InMemory")
{
    // Use EF operations for in-memory testing
    context.SchedulePlayoffs.RemoveRange(context.SchedulePlayoffs);
}
else
{
    // Use raw SQL for production SQL Server
    await context.Database.ExecuteSqlRawAsync("DELETE FROM SchedulePlayoffs");
}
```

### Game Time Generation
Games are scheduled at consistent times:
- Saturday games: 2:00 PM, 4:00 PM, 6:00 PM
- Sunday games: 1:00 PM, 3:00 PM, 5:00 PM

### Dependencies
The seeder requires:
- `ISeasonRepository` - To get current season information
- `IDivisionRepository` - To determine division structure
- `ILocationRepository` - To assign game locations
- `ISchedulePlayoffRepository` - To save playoff games

## Usage

The seeder is automatically registered in dependency injection and executed by the `SeedCoordinator`:

```csharp
// In ServiceCollectionExtensions.cs
services.AddTransient<ISeeder<SchedulePlayoff>, SchedulePlayoffSeeder>();

// In SeedCoordinator.cs
await _schedulePlayoffSeeder.DeleteAllAsync();
await _schedulePlayoffSeeder.SeedAsync();
```

## Game Structure

### Composite Key
Each playoff game uses a composite key:
- `ScheduleNumber`: Identifies the game round (1001, 1002, 1003)
- `GameNumber`: Sequential number within each round

### Game Naming Convention
- **Round Names**: "Quarterfinals", "Semifinals", "Championship"
- **Team Names**: Generic format like "Team 8 vs Team 1"
- **Game Times**: Weekend scheduling with standard time slots

## Testing

The seeder includes comprehensive unit tests:
- Constructor validation
- Database deletion functionality  
- Basic seeding operations
- Cross-platform database compatibility

## Future Enhancements

Potential improvements could include:
- Dynamic bracket sizing based on actual team count
- Configurable game times and schedules
- Integration with actual team standings
- Support for different tournament formats (single elimination, double elimination)
- Playoff game result tracking and bracket advancement

## Error Handling

The seeder includes robust error handling:
- Graceful fallback when no locations are available
- Database provider detection for compatibility
- Debug logging for troubleshooting
- Safe deletion operations that work across environments
