# Database Changes Summary for Develop Environment

**Date:** 2025-12-24
**Issue:** 500 error when saving player registration form in develop environment

## Root Cause

The develop environment database is missing 3 migrations that are present in the codebase. Specifically, the `Player.PayType` column is still `NVARCHAR(5)` in the database but the code expects `NVARCHAR(20)`, causing SQL truncation errors when saving player registrations with payment types longer than 5 characters.

## Current State

### Applied Migrations (Develop Database)
1. ✅ `20250725132131_InitialMigration`
2. ✅ `20250725133215_FixLocationIdentity`

### Pending Migrations (Not Applied)
3. ❌ `20250731115033_RestructureSchedulePlayoffsTableWithBackup`
4. ❌ `20250731120000_SchedulePlayoffCustomRestructure`
5. ❌ `20251216152000_IncreasePayTypeLength` **← CRITICAL: Fixes the 500 error**

## Required Database Changes

### 1. Player Table - PayType Column (CRITICAL - FIXES 500 ERROR)
**Migration:** `20251216152000_IncreasePayTypeLength`
**Priority:** HIGH - This is causing the production issue

```sql
ALTER TABLE Player
  ALTER COLUMN PayType NVARCHAR(20) NULL;
```

**Impact:**
- Changes `PayType` from `NVARCHAR(5)` to `NVARCHAR(20)`
- Allows payment types like "Cash", "Check", "Credit Card", etc.
- Fixes the 500 error on player registration form submission

### 2. SchedulePlayoffs Table Restructure
**Migrations:**
- `20250731115033_RestructureSchedulePlayoffsTableWithBackup`
- `20250731120000_SchedulePlayoffCustomRestructure`

**Priority:** MEDIUM - Required for schema consistency

**Changes:**
- Adds `SchedulePlayoffID` as identity primary key
- Changes `ScheduleNumber` from identity to regular column
- Standardizes column types:
  - `GameTime`: `NVARCHAR(20)` (was `NVARCHAR(MAX)`)
  - `VisitingTeam`: `NVARCHAR(10)` (was `NVARCHAR(MAX)`)
  - `HomeTeam`: `NVARCHAR(10)` (was `NVARCHAR(MAX)`)
  - `Descr`: `NVARCHAR(50)` (was `NVARCHAR(MAX)`)
  - `GameDate`: `DATETIME` (was `DATETIME2`)
- Creates backup table before restructure
- Restores all existing data after restructure

## Application Options

### Option 1: Run SQL Script (Recommended for Immediate Fix)
Execute the consolidated script that contains all pending migrations:

```bash
# File: SQL/PendingMigrations-Develop.sql
```

This script includes:
- All pending migrations in correct order
- Verification queries to confirm success
- Comments explaining each change

**Steps:**
1. Connect to develop database using SQL Server Management Studio or Azure Data Studio
2. Open `SQL/PendingMigrations-Develop.sql`
3. Review the script
4. Execute the script
5. Run the verification queries at the end
6. Test player registration form

### Option 2: Apply via Entity Framework Migrations
Run the EF Core migration command to apply all pending migrations:

```bash
dotnet ef database update --project src/Hoops.Infrastructure --startup-project src/Hoops.Api
```

**Note:** This requires connection string access to the develop database and the startup project to be configured for the develop environment.

### Option 3: Quick Fix (PayType Only)
If you only want to fix the immediate 500 error, run just the PayType change:

```sql
ALTER TABLE Player ALTER COLUMN PayType NVARCHAR(20) NULL;
```

**Warning:** This leaves the SchedulePlayoffs migrations unapplied, which may cause issues later.

## Verification Steps

After applying the migrations, verify the changes:

### 1. Check PayType Column
```sql
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Player' AND COLUMN_NAME = 'PayType';
```

**Expected Result:**
- DATA_TYPE: `nvarchar`
- CHARACTER_MAXIMUM_LENGTH: `20`
- IS_NULLABLE: `YES`

### 2. Check Applied Migrations
```sql
SELECT MigrationId, ProductVersion
FROM __EFMigrationsHistory
ORDER BY MigrationId;
```

**Expected Migrations:**
```
20250725132131_InitialMigration
20250725133215_FixLocationIdentity
20250731115033_RestructureSchedulePlayoffsTableWithBackup
20250731120000_SchedulePlayoffCustomRestructure
20251216152000_IncreasePayTypeLength
```

### 3. Test Player Registration
1. Navigate to the player registration form in develop environment
2. Fill out the form with a payment type (e.g., "Cash" or "Credit Card")
3. Submit the form
4. Verify no 500 error occurs
5. Verify the player record is saved successfully

## Files Created

1. **SQL/PendingMigrations-Develop.sql** - Complete migration script with all pending changes
2. **SQL/DATABASE-CHANGES-SUMMARY.md** - This summary document

## Next Steps

1. Apply the migrations to develop environment (choose option above)
2. Verify the changes using the verification queries
3. Test the player registration form
4. Consider applying these same migrations to any other environments that might be out of sync
5. Update your deployment process to ensure migrations are applied automatically during deployments

## Notes

- The migrations in this script are idempotent where possible (e.g., checking if backup tables exist)
- Always backup your database before applying migrations
- Test in develop before applying to production
- Consider adding migration application to your CI/CD pipeline to prevent this issue in the future
