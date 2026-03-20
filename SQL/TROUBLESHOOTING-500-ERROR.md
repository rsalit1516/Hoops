# Troubleshooting 500 Error - Player Registration

**Status:** In Progress
**Last Updated:** 2025-12-24

## Current Situation

You ran the PayType migration but are still getting a 500 error when saving player registrations. The error message shows an EF Core save exception but doesn't reveal the actual database error.

## Changes Made

### 1. Improved Error Logging ✅
Updated `PlayerFunctions.cs` to include inner exception details in error messages:
- File: `src/Hoops.Functions/Functions/PlayerFunctions.cs`
- Line: 163-164
- Change: Now logs `ex.InnerException.Message` which will show the actual SQL error

### 2. Build Completed ✅
The Functions project has been rebuilt with the improved error logging.

## Next Steps

### Step 1: Deploy the Updated Function App
Deploy the rebuilt Functions app to your develop environment to get better error messages:

```bash
# From the repository root
dotnet publish src/Hoops.Functions/Hoops.Functions.csproj -c Release -o ./publish

# Then deploy using your preferred method (Azure CLI, VS Code, etc.)
```

**OR** if using Azure CLI:
```bash
# Publish and zip
cd src/Hoops.Functions
func azure functionapp publish <your-function-app-name>
```

### Step 2: Verify Database Migration Was Applied
Run this query on your **develop database** to verify PayType was updated:

```sql
-- File: SQL/Verify-PayType-Column.sql
SELECT
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Player' AND COLUMN_NAME = 'PayType';
```

**Expected Result:**
- `DATA_TYPE`: `nvarchar`
- `CHARACTER_MAXIMUM_LENGTH`: `20`

**If you see `5` instead of `20`**, the migration didn't apply. Run:
```sql
ALTER TABLE Player ALTER COLUMN PayType NVARCHAR(20) NULL;
```

### Step 3: Test Again and Get Full Error Details
1. Deploy the updated Function App
2. Try to save a player registration again
3. Check the error message - it will now include the **inner exception** which shows the actual SQL error
4. Share the full error message including the inner exception

### Step 4: Run Comprehensive Diagnostics
If the error persists after Step 3, run the diagnostic script to check for other issues:

```sql
-- File: SQL/Diagnose-Player-Table.sql
-- This script checks:
-- - All Player table columns and constraints
-- - Foreign key constraints
-- - NOT NULL columns without defaults
-- - Invalid foreign key references
-- - Recent player records
```

## Common Issues to Check

### Issue 1: PayType Migration Not Applied
**Symptom:** Error mentions string truncation or "would be truncated"
**Fix:** Run `ALTER TABLE Player ALTER COLUMN PayType NVARCHAR(20) NULL;`

### Issue 2: Foreign Key Violation
**Symptom:** Error mentions "FOREIGN KEY constraint"
**Likely columns:**
- `PeopleID` (PersonId) - must exist in `People` table
- `DivisionID` - must exist in `Divisions` table
- `SeasonID` - must exist in `Seasons` table
- `TeamID` - must exist in `Teams` table (if provided)

**Check with:**
```sql
-- Verify foreign key tables exist
SELECT COUNT(*) FROM People WHERE PeopleID = <value>;
SELECT COUNT(*) FROM Divisions WHERE DivisionID = <value>;
SELECT COUNT(*) FROM Seasons WHERE SeasonID = <value>;
```

### Issue 3: NULL Constraint Violation
**Symptom:** Error mentions "cannot insert NULL" or "does not allow nulls"
**Required columns:**
- `PlayerID` - auto-generated (identity)
- `PeopleID` (PersonId) - required in the model

**Check Player.cs** at src/Hoops.Core/Models/Player.cs:21 - PersonId is NOT nullable

### Issue 4: String Length Violations (Other Columns)
**Potential columns with length limits:**
- `CheckMemo`: NVARCHAR(50)
- `NoteDesc`: NVARCHAR(50)
- `DraftNotes`: NVARCHAR(100)
- `DraftId`: NVARCHAR(3)
- `CreatedUser`: NVARCHAR(20)

**Symptom:** Error mentions "would be truncated" for these columns

### Issue 5: Invalid Data Type
**Symptom:** Error mentions type conversion or invalid value
**Check:**
- `PaidDate`, `CreatedDate`: Must be valid DateTime
- `PaidAmount`, `BalanceOwed`: Must be valid decimal/money
- Boolean fields: Must be 0/1 or true/false

## Diagnostic Files Created

1. **SQL/PendingMigrations-Develop.sql** - All pending migrations
2. **SQL/DATABASE-CHANGES-SUMMARY.md** - Detailed migration documentation
3. **SQL/Verify-PayType-Column.sql** - Quick PayType verification
4. **SQL/Diagnose-Player-Table.sql** - Comprehensive table diagnostics
5. **SQL/TROUBLESHOOTING-500-ERROR.md** - This file

## What to Do Next

**Immediate Action:**
1. ✅ Rebuild completed (already done)
2. ⬜ Deploy updated Function App to develop environment
3. ⬜ Verify PayType column using `SQL/Verify-PayType-Column.sql`
4. ⬜ Test player registration again
5. ⬜ **Share the new error message** (with inner exception details)

**Then I can:**
- Identify the exact SQL error from the inner exception
- Provide a targeted fix
- Help you prevent this issue in production

## Questions to Answer

To help diagnose faster, please provide:

1. **What is the PayType value** being sent in the player registration?
2. **What is the PersonId** being sent?
3. **What is the SeasonId** being sent?
4. **What is the DivisionId** being sent (if any)?
5. **Are there any other fields** being sent in the request?

You can check the browser's Network tab or the request payload being sent from the Angular app.

## Prevention for Future

Once resolved, consider:
1. Add migration application to CI/CD pipeline
2. Add database schema validation tests
3. Document required migration steps for deployments
4. Consider using EF Core's `dotnet ef database update` in deployment scripts
