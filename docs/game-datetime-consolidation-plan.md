# Game DateTime Consolidation Plan

## Overview
This document outlines the strategy for consolidating the `GameDate` and `GameTime` fields in the `ScheduleGames` table to use a single `GameDate` field that contains both date and time information.

## Current State
- **GameDate**: `DateTime` field containing only the date portion (time is typically 00:00:00)
- **GameTime**: `string` field containing time in legacy format like "7:00:00 PM" or "1899-12-30 18:00:00"
- **Issue**: Having two separate fields for date/time creates complexity and potential inconsistency

## Target State
- **GameDate**: `DateTime` field containing both date AND time
- **GameTime**: Field to be eventually removed (kept temporarily during transition)
- **Benefit**: Single source of truth for game scheduling, simplified queries, better data integrity

## Migration Strategy

### Phase 1: Update Seeding Logic ✅ 
**Status**: Completed
- Modified `ScheduleGameSeeder.cs` to populate both fields correctly:
  - `GameDate`: Full DateTime with date and time combined
  - `GameTime`: Legacy format `'1899-12-30 HH:mm:ss'` where date is ignored, time is parsed
- Updated `GameTimeSlotManager` to return both time string and `TimeSpan`
- New seeded data will follow the target pattern

### Phase 2: Update Import Logic 🔄
**Status**: In Progress (User Task)
- Update data import routines to follow the same pattern as seeding
- Ensure imported games have:
  - `GameDate`: Complete DateTime
  - `GameTime`: Legacy format for compatibility
- Test import with sample data

### Phase 3: Update Application Logic 📋
**Status**: Planned
- **API Layer**: Modify controllers to use `GameDate` for all date/time operations
- **Repository Layer**: Update queries to use `GameDate` instead of combining fields
- **Frontend**: Update Angular components to display time from `GameDate`
- **ViewModels**: Update to expose formatted date/time from `GameDate`

### Phase 4: Data Migration 📋
**Status**: Planned
- Create migration script to update existing data:
  ```sql
  -- Example migration approach
  UPDATE ScheduleGames 
  SET GameDate = CASE 
    WHEN GameTime LIKE '1899-12-30%' THEN 
      -- Parse time from legacy format
      DATEADD(MINUTE, 
        DATEPART(HOUR, CAST(GameTime AS DATETIME)) * 60 + 
        DATEPART(MINUTE, CAST(GameTime AS DATETIME)), 
        CAST(CAST(GameDate AS DATE) AS DATETIME))
    WHEN GameTime LIKE '%:%' THEN 
      -- Parse time from string format like "7:00 PM"
      CAST(CAST(GameDate AS DATE) AS DATETIME) + 
      CAST(CASE 
        WHEN GameTime LIKE '%PM' AND LEFT(GameTime, 2) != '12' THEN 
          DATEADD(HOUR, 12, CAST('1900-01-01 ' + REPLACE(GameTime, ' PM', ':00') AS DATETIME))
        ELSE 
          CAST('1900-01-01 ' + REPLACE(REPLACE(GameTime, ' PM', ':00'), ' AM', ':00') AS DATETIME)
      END AS TIME)
    ELSE GameDate -- Keep as-is if no time info
  END
  WHERE GameTime IS NOT NULL
  ```

### Phase 5: Remove GameTime Field 📋
**Status**: Planned
- Remove `GameTime` column from database schema
- Remove `GameTime` property from `ScheduleGame` model
- Update Entity Framework configuration
- Clean up any remaining references in code

## Implementation Details

### Code Changes Made

#### ScheduleGameSeeder.cs
```csharp
// Create full DateTime with date and time combined
var fullGameDateTime = gameDate.Date.Add(timeSlotInfo.timeSpan);

// Create legacy GameTime format: '1899-12-30 HH:mm:ss' (ignore date, use time only)
var legacyGameTime = new DateTime(1899, 12, 30).Add(timeSlotInfo.timeSpan).ToString("yyyy-MM-dd HH:mm:ss");

var game = new ScheduleGame
{
    GameDate = fullGameDateTime, // Now contains both date and time
    GameTime = legacyGameTime, // Legacy format for transition period
    // ... other properties
};
```

#### GameTimeSlotManager Updates
- Returns tuple `(string timeString, TimeSpan timeSpan)` instead of just string
- Provides both display format and TimeSpan for calculations

### Testing Strategy

1. **Seeding Tests**
   - Verify new games have correct DateTime in `GameDate`
   - Verify `GameTime` follows legacy format
   - Confirm time calculations are accurate

2. **API Tests**
   - Test `GetSeasonGames` with new DateTime format
   - Test `GetStandings` calculations
   - Verify date/time filtering works correctly

3. **Migration Tests**
   - Test migration script on copy of production data
   - Verify no data loss during conversion
   - Confirm all time formats are handled correctly

### Rollback Plan
- Keep `GameTime` field during transition for safety
- Can revert to using `GameTime` if issues arise
- Migration script should be reversible

### Timeline
- **Phase 1**: ✅ Complete (Seeding Logic)
- **Phase 2**: 1-2 weeks (Import Logic)
- **Phase 3**: 2-3 weeks (Application Logic)
- **Phase 4**: 1 week (Data Migration)
- **Phase 5**: 1 week (Cleanup)

**Total Estimated Time**: 5-7 weeks

### Risk Mitigation
- Gradual rollout with extensive testing
- Maintain backward compatibility during transition
- Database backups before each phase
- Ability to rollback at each step
- Monitor application performance after changes

### Success Criteria
- [ ] All new games use consolidated DateTime format
- [ ] No data loss during migration
- [ ] API responses remain consistent
- [ ] Frontend displays times correctly
- [ ] Performance is maintained or improved
- [ ] GameTime field successfully removed

## Notes
- Legacy format `'1899-12-30 HH:mm:ss'` chosen for compatibility with existing import tools
- Date portion (1899-12-30) is ignored, only time portion is used
- This approach allows gradual transition while maintaining compatibility
