# Game Seeding Implementation for Basketball League

## Overview
I have successfully implemented a comprehensive game seeding system for the basketball league application using a dedicated `ScheduleGameSeeder` class that creates a full season schedule following all the specified constraints.

## Architecture Updates

### Refactoring to Dedicated Seeder Classes
The implementation has been refactored to follow a clean architecture pattern with dedicated seeder classes:

- **`ScheduleGameSeeder`**: Handles all game scheduling logic
- **`LocationSeeder`**: Manages location creation and seeding
- **`SeedCoordinator`**: Orchestrates all seeder classes in the correct order
- **Individual Entity Seeders**: `ColorSeeder`, `SeasonSeeder`, `DivisionSeeder`, `TeamSeeder`, etc.

### Key Benefits of This Architecture
- **Separation of Concerns**: Each seeder is responsible for one entity type
- **Maintainability**: Easy to modify individual seeding logic
- **Testability**: Each seeder can be tested independently
- **Reusability**: Seeders can be used independently if needed

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

#### 1. ScheduleGameSeeder Class
```csharp
public class ScheduleGameSeeder : ISeeder<ScheduleGame>
{
    // Dependencies injected for repository access
    private readonly IScheduleGameRepository _scheduleGameRepo;
    private readonly ISeasonRepository _seasonRepo;
    // ... other repositories
    
    public async Task SeedAsync()
    {
        // Main orchestration method for game generation
    }
    
    public async Task DeleteAllAsync()
    {
        // Cleans up existing games
    }
}
```

#### 2. SeedCoordinator Updates
```csharp
public class SeedCoordinator
{
    // Now uses dedicated seeder classes
    private ScheduleGameSeeder _scheduleGameSeeder;
    
    public async Task InitializeDataAsync()
    {
        // Orchestrates all seeders in correct order
        await _scheduleGameSeeder.SeedAsync();
    }
}
```

#### 3. Game Generation Methods
- `SeedAsync()`: Main orchestration method
- `GenerateScheduleForDivision()`: Creates schedule for a specific division
- `GenerateRoundRobinRound()`: Implements round-robin algorithm
- `FindNextAvailableDate()`: Ensures rest day constraints
- `GameTimeSlotManager`: Manages time slots and prevents conflicts

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
- Works with locations created by `LocationSeeder`

## Service Registration
The new seeders are registered in the dependency injection container:

```csharp
services.AddScoped<ScheduleGameSeeder>();
services.AddScoped<LocationSeeder>();
```

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
The game seeding is automatically called as part of the `InitializeDataAsync()` method in `SeedCoordinator`. The seeding process now follows this order:

1. Delete all existing data (games, teams, divisions, etc.)
2. Seed colors via `ColorSeeder`
3. Seed locations via `LocationSeeder`
4. Seed seasons via `SeasonSeeder`
5. Seed divisions via `DivisionSeeder`
6. Seed teams via `TeamSeeder`
7. **Seed games via `ScheduleGameSeeder`**
8. Seed web content and other data

## Benefits
- **Fully automated**: No manual schedule creation needed
- **Constraint compliance**: All rules are automatically enforced
- **Scalable**: Works with any number of teams, divisions, and locations
- **Flexible**: Easy to modify rules or add new constraints
- **Clean Architecture**: Follows single responsibility principle
- **Maintainable**: Each seeder can be modified independently
- **Testable**: Individual seeders can be unit tested

The implementation provides a robust, maintainable foundation for managing basketball league schedules while maintaining all the specified business rules and constraints.
