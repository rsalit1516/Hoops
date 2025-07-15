# Game Seeding Implementation for Basketball League

## Overview
I have successfully implemented a comprehensive game seeding system for the basketball league application that creates a full season schedule following all the specified constraints.

## Key Features Implemented

### 1. Schedule Generation Logic
- **Round-robin tournament**: Every team plays every other team in their division
- **Automatic scheduling**: Games are scheduled across the entire season
- **Multiple divisions**: Each division gets its own independent schedule

### 2. Time Constraints
- **Weeknight games**: Start at 6:00 PM, with slots at 7:00 PM, 8:00 PM, and 9:00 PM (50-minute games with 10-minute breaks)
- **Weekend games**: Start at 9:00 AM, with slots at 10:00 AM, 11:00 AM, and 12:00 PM
- **No scheduling conflicts**: Only one game per time slot per location

### 3. Team Constraints
- **One game per day**: Each team can only play one game per day
- **Rest days**: At least one day rest between games for each team
- **Even matchups**: All teams play each other exactly once (round-robin)

### 4. Location Management
- **Multiple locations**: Supports multiple game locations
- **Location rotation**: Games are distributed across available locations
- **Time slot management**: Prevents double-booking of locations

## Implementation Details

### Core Components

#### 1. SeedCoordinator Updates
```csharp
// Added IScheduleGameRepository dependency
public IScheduleGameRepository scheduleGameRepo { get; private set; }

// Added to initialization sequence
await DeleteGamesAsync();
await CreateGamesAsync();
```

#### 2. Game Generation Methods
- `InitializeGamesAsync()`: Main orchestration method
- `GenerateScheduleForDivision()`: Creates schedule for a specific division
- `GenerateRoundRobinRound()`: Implements round-robin algorithm
- `FindNextAvailableDate()`: Ensures rest day constraints
- `GameTimeSlotManager`: Manages time slots and prevents conflicts

#### 3. Scheduling Algorithm
```csharp
private async Task GenerateScheduleForDivision(Season season, Division division, 
    List<Team> teams, List<Location> locations)
{
    // Round-robin tournament generation
    var totalRounds = teams.Count - 1;
    var gamesPerRound = teams.Count / 2;
    
    // Time slot and location management
    // Rest day enforcement
    // Weekend/weeknight alternation
}
```

### Smart Scheduling Features

#### 1. Time Slot Management
- Tracks used time slots per location per day
- Automatically finds next available slot
- Supports different schedules for weekdays vs weekends

#### 2. Rest Day Enforcement
- Tracks each team's last game date
- Ensures minimum one day between games
- Automatically finds next valid date if conflict exists

#### 3. Location Distribution
- Rotates games across available locations
- Prevents location conflicts
- Creates sample locations if none exist

## Database Schema Compatibility
The implementation works with the existing `ScheduleGame` model:
- `ScheduleGamesId`: Auto-generated unique identifier
- `ScheduleNumber`: Based on division ID
- `GameNumber`: Sequential game number
- `LocationNumber`: References location
- `GameDate`: Scheduled game date
- `GameTime`: Scheduled game time (string format)
- `HomeTeamNumber`/`VisitingTeamNumber`: Team references
- `SeasonId`/`DivisionId`: Foreign key references

## Usage
The game seeding is automatically called as part of the `InitializeDataAsync()` method in `SeedCoordinator`. When you run the seeding process, it will:

1. Delete existing games
2. Create seasons, divisions, and teams
3. Generate complete game schedules for all divisions
4. Ensure all constraints are met

## Benefits
- **Fully automated**: No manual schedule creation needed
- **Constraint compliance**: All rules are automatically enforced
- **Scalable**: Works with any number of teams, divisions, and locations
- **Flexible**: Easy to modify rules or add new constraints
- **Reliable**: Prevents scheduling conflicts and ensures fair play

The implementation provides a robust foundation for managing basketball league schedules while maintaining all the specified business rules and constraints.
