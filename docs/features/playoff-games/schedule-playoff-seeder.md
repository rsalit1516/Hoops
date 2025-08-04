# Schedule Playoff Seeder

## Overview

The `SchedulePlayoffSeeder` is responsible for creating playoff games that occur at the end of the regular season. This seeder follows the existing pattern of other seeders in the application and integrates with the current database structure.

## Features

### Playoff Structure
- **Minimum Team Requirement**: Requires at least 4 teams per division to generate playoffs
- **Bracket Format**: Uses a tournament bracket structure with:
  - Quarterfinals (for 8+ teams)
  - Semifinals  
  - Championship game
- **Team Pairing**: Last place vs First place, Second-to-last vs Second place, etc.

### Team Naming Convention
- Uses generic team names like "Team 1", "Team 2", etc.
- No direct linkage to actual team records (as requested)
- Winners advance using placeholders like "Winner QF1", "Winner SF2"

### Scheduling Logic
- **Timing**: Playoffs scheduled 2 weeks before season end date
- **Weekend Games**: All playoff games scheduled on Saturdays and Sundays
- **Time Slots**: Rotates through 9:00 AM, 11:00 AM, 1:00 PM, 3:00 PM
- **Location Assignment**: Rotates through available locations

### Database Integration
- Uses existing `SchedulePlayoff` table structure
- Maintains compatibility with existing `SchedulePlayoffRepository`
- Integrates with current seeding infrastructure via `SeedCoordinator`

## Usage

The seeder is automatically executed as part of the overall seeding process when `SeedCoordinator.InitializeDataAsync()` is called. It runs after regular season games are seeded.

### Manual Usage
```csharp
// Create seeder instance (normally done via DI)
var seeder = new SchedulePlayoffSeeder(
    schedulePlayoffRepo,
    seasonRepo,
    divisionRepo,
    locationRepo,
    context
);

// Delete existing playoff games
await seeder.DeleteAllAsync();

// Generate new playoff games
await seeder.SeedAsync();
```

## Configuration

### Playoff Structure Examples

**4-6 Teams**: Direct to Semifinals + Championship
- Game 1: Team 1 vs Team 4 (Semifinal)
- Game 2: Team 2 vs Team 3 (Semifinal)  
- Game 3: Winner SF1 vs Winner SF2 (Championship)

**8+ Teams**: Quarterfinals + Semifinals + Championship
- Game 1: Team 1 vs Team 8 (Quarterfinal)
- Game 2: Team 2 vs Team 7 (Quarterfinal)
- Game 3: Team 3 vs Team 6 (Quarterfinal)
- Game 4: Team 4 vs Team 5 (Quarterfinal)
- Game 5: Winner QF1 vs Winner QF4 (Semifinal)
- Game 6: Winner QF2 vs Winner QF3 (Semifinal)
- Game 7: Winner SF1 vs Winner SF2 (Championship)

## Dependencies

- `ISchedulePlayoffRepository`: For database operations
- `ISeasonRepository`: To get season information and end dates
- `IDivisionRepository`: To get divisions for each season
- `ILocationRepository`: To get available game locations
- `hoopsContext`: Entity Framework context for data access

## Testing

The seeder includes comprehensive unit tests covering:
- Playoff game creation for valid divisions
- Skipping divisions with insufficient teams
- Correct bracket structure generation
- Weekend scheduling validation
- Location assignment verification
- Database cleanup functionality

## Future Enhancements

Potential improvements could include:
- Configurable playoff structures (single elimination, double elimination)
- Custom team ranking integration
- Flexible scheduling patterns
- Advanced conflict resolution for locations and times
