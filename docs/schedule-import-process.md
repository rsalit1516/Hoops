# Schedule Import Process Documentation

## Overview
The schedule import process involves coordination between external scheduling software and the internal admin system.

## Current Workflow

### Step 1: External Schedule Generation
- A 3rd party scheduling program generates game schedules and team assignments
- This creates data for `ScheduleDivTeams` and `ScheduleGames` tables
- **Important**: These tables initially have NO `SeasonId` or `DivisionId` values
- The external program uses its own numbering scheme:
  - `ScheduleNumber`: Identifies a specific schedule/division grouping
  - `DivisionNumber`: External program's division identifier
  - `TeamNumber`: Sequential team numbers across the entire season
  - `ScheduleTeamNumber`: Team numbers within a specific division (1, 2, 3, etc.)

### Step 2: Data Import
- Import the generated `ScheduleDivTeams` and `ScheduleGames` data into the database
- At this point, the data has `ScheduleNumber` and other external identifiers but no internal IDs

### Step 3: Season Assignment (Manual)
- Manually set the `SeasonId` for all imported records in both tables
- This links the imported schedule data to the correct season in the system
```sql
UPDATE ScheduleGames SET SeasonId = [target_season_id] WHERE SeasonId IS NULL;
UPDATE ScheduleDivTeams SET SeasonId = [target_season_id] WHERE SeasonId IS NULL;
```

### Step 4: Admin Division Creation (Parallel Process)
- Users create divisions, teams, and other organizational data through the admin interface
- This populates the `Divisions` table with proper `DivisionId` values
- These divisions represent the organizational structure (age groups, skill levels, etc.)

### Step 5: Division Mapping (Manual)
- Manually update `ScheduleGames` to map external schedules to internal divisions
- This requires knowledge of which `ScheduleNumber` corresponds to which `DivisionId`
```sql
UPDATE ScheduleGames 
SET DivisionId = [internal_division_id] 
WHERE ScheduleNumber = [external_schedule_number] AND SeasonId = [season_id];
```

## Data Relationships

### Key Linking Logic
1. **Find Schedule Data**: Use `ScheduleGames.ScheduleNumber` to identify a group of games
2. **Find Team Data**: Query `ScheduleDivTeams` where `ScheduleNumber` matches and `SeasonId` matches
3. **Link to Admin Data**: Use `ScheduleGames.DivisionId` to connect to admin-created divisions
4. **Get Team Names**: Map `ScheduleDivTeams.ScheduleTeamNumber` to `Teams.TeamNumber` (with type conversion)

### Table Relationships
```
ScheduleGames.ScheduleNumber = ScheduleDivTeams.ScheduleNumber (Same schedule group)
ScheduleGames.SeasonId = ScheduleDivTeams.SeasonId (Same season)
ScheduleGames.DivisionId = Divisions.DivisionId (Links to admin divisions)
ScheduleGames.HomeTeamNumber = ScheduleDivTeams.TeamNumber (Team assignments)
ScheduleGames.VisitingTeamNumber = ScheduleDivTeams.TeamNumber (Team assignments)
ScheduleDivTeams.ScheduleTeamNumber = CAST(Teams.TeamNumber AS int) (Team name lookup)
```

### Team Number Mapping
The system uses **three different team numbering schemes**:

1. **Season-Wide Sequential** (`ScheduleDivTeams.TeamNumber`, `ScheduleGames.HomeTeamNumber/VisitingTeamNumber`):
   - External program assigns sequential numbers across entire season
   - Example: Teams 1-9, 10-20, 21-26 for divisions 1, 2, 3 respectively

2. **Division-Specific** (`ScheduleDivTeams.ScheduleTeamNumber`):
   - Numbers teams 1, 2, 3, etc. within each division
   - Used for mapping to admin-created teams

3. **Admin Team Numbers** (`Teams.TeamNumber` - nvarchar):
   - Created through admin interface as string values
   - Should match `ScheduleTeamNumber` but requires type conversion

### Technical Debt
⚠️ **Data Type Inconsistency**: `Teams.TeamNumber` is `nvarchar` but should be `int` for consistency with `ScheduleDivTeams.ScheduleTeamNumber`. This requires conversion logic: `ScheduleDivTeams.ScheduleTeamNumber` (int) → `CAST(Teams.TeamNumber AS int)` for proper mapping.

## Code Implementation

### Repository Logic (GetStandings)
```csharp
// 1. Get games for the division
var seasonGames = context.ScheduleGames
    .Where(g => g.DivisionId == divisionId && g.SeasonId == seasonId)
    .ToList();

// 2. Extract the ScheduleNumber from games
var scheduleNumber = seasonGames[0].ScheduleNumber;

// 3. Find matching teams using ScheduleNumber (NOT DivisionNumber)
var divTeams = context.ScheduleDivTeams
    .Where(div => div.SeasonId == seasonId && div.ScheduleNumber == scheduleNumber)
    .ToList();
```

## Future Improvements
1. **Automate Season Assignment**: Add import tools to automatically set SeasonId
2. **Division Mapping Interface**: Create admin UI to map ScheduleNumber to DivisionId
3. **Validation Tools**: Add checks to ensure data consistency between tables
4. **Import Workflow**: Streamline the import process to reduce manual steps
5. **Documentation**: Better document which ScheduleNumber maps to which division type
6. **🔧 Technical Debt - Team Number Data Type**: Convert `Teams.TeamNumber` from `nvarchar` to `int` to match `ScheduleDivTeams.ScheduleTeamNumber` and eliminate type conversion requirements

## Troubleshooting
- **Empty Standings**: Check that ScheduleNumber values match between tables
- **Missing Teams**: Verify SeasonId is set correctly in both tables  
- **Wrong Division**: Confirm DivisionId mapping in ScheduleGames table
- **Team Name Issues**: Verify `ScheduleDivTeams.ScheduleTeamNumber` maps to `CAST(Teams.TeamNumber AS int)` correctly
