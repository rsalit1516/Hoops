# Data Integrity Issue Fix for ScheduleGames Team Numbers

## Problem Description

**ScheduleGamesID = 113323** and potentially other games have invalid team numbers stored:

- `visitingTeamNumber: 18` - No corresponding ScheduleDivTeam mapping exists
- `homeTeamNumber: 7` - No corresponding ScheduleDivTeam mapping exists

This causes:

1. Null/empty team names in game lists
2. "All Teams" dropdown when editing games
3. Games appearing to disappear from filtered views

## Root Cause

The **ScheduleGameSeeder** is storing season-wide `TeamNumber` values from ScheduleDivTeams, but these numbers don't have valid reverse mappings in the same table. This indicates:

1. **Possible Race Condition**: ScheduleDivTeams might be seeded after ScheduleGames
2. **Inconsistent Team Numbering**: The seeding logic creates gaps or invalid references
3. **Missing Data Validation**: No checks ensure team numbers exist before storing games

## Data Analysis Results

- Season 9320, Schedule 2 has no valid ScheduleDivTeam mappings
- API calls to `GetMappedTeamNumber` and `GetDisplayTeamNumber` return 0 for all tested team numbers
- Division 9960 (JV Boys) has teams numbered 1-9 in Teams table
- But stored game references use numbers like 18 and 7 that don't map correctly

## Recommended Solution

### 1. Fix Seeding Order Dependencies

Ensure ScheduleDivTeams is fully seeded before ScheduleGames:

```csharp
// In your seeding pipeline
await ScheduleDivTeamsSeeder.SeedAsync();
await context.SaveChangesAsync(); // Ensure persistence
await ScheduleGameSeeder.SeedAsync(); // Now references are valid
```

### 2. Add Data Validation in ScheduleGameSeeder

Before creating a game, verify team mappings exist:

```csharp
// Validate teams exist in ScheduleDivTeams
var homeTeamExists = await _scheduleDivTeamsRepo.GetTeamNo(scheduleNumber, homeTeam.ScheduleTeamNumber, season.SeasonId);
var visitingTeamExists = await _scheduleDivTeamsRepo.GetTeamNo(scheduleNumber, visitingTeam.ScheduleTeamNumber, season.SeasonId);

if (homeTeamExists == 0 || visitingTeamExists == 0)
{
    Console.WriteLine($"[WARNING] Skipping game - invalid team mapping: Home={homeTeam.ScheduleTeamNumber}, Visiting={visitingTeam.ScheduleTeamNumber}");
    continue;
}
```

### 3. Data Cleanup for Existing Records

Create a cleanup script to fix existing invalid references:

```sql
-- Find orphaned games with invalid team numbers
SELECT sg.ScheduleGamesId, sg.VisitingTeamNumber, sg.HomeTeamNumber, sg.ScheduleNumber, sg.SeasonId
FROM ScheduleGames sg
LEFT JOIN ScheduleDivTeams sdt_home ON
    sdt_home.TeamNumber = sg.HomeTeamNumber AND
    sdt_home.ScheduleNumber = sg.ScheduleNumber AND
    sdt_home.SeasonId = sg.SeasonId
LEFT JOIN ScheduleDivTeams sdt_visiting ON
    sdt_visiting.TeamNumber = sg.VisitingTeamNumber AND
    sdt_visiting.ScheduleNumber = sg.ScheduleNumber AND
    sdt_visiting.SeasonId = sg.SeasonId
WHERE sdt_home.TeamNumber IS NULL OR sdt_visiting.TeamNumber IS NULL;
```

### 4. Enhanced Frontend Error Handling

Update the admin game detail form to handle missing team mappings gracefully:

```typescript
// In admin-game-detail.component.ts
loadTeamForSelection(teamNumber: number): void {
  if (teamNumber === 0 || !teamNumber) {
    console.warn('Invalid team number, defaulting to first team');
    this.selectedTeam = this.availableTeams[0];
    return;
  }

  const team = this.availableTeams.find(t => t.teamNumber === teamNumber);
  if (!team) {
    console.warn(`Team number ${teamNumber} not found in division, showing all teams`);
    // Allow user to select correct team
  }
  this.selectedTeam = team;
}
```

## Implementation Priority

1. **Immediate**: Add validation to prevent new invalid games
2. **Short-term**: Run data cleanup to fix existing orphaned records
3. **Long-term**: Implement comprehensive data integrity constraints

## Testing Requirements

After implementation, verify:

- [ ] All ScheduleGames have valid team number mappings
- [ ] Game lists show correct team names
- [ ] Game edit forms show correct team selections
- [ ] No "All Teams" dropdowns appear for valid games
- [ ] Seeding process completes without warnings

## Related Issues

This fix addresses the core data integrity problem that affects:

- Game list display (null team names)
- Game editing functionality (incorrect dropdowns)
- Filtering and search capabilities
- Reporting and statistics accuracy
