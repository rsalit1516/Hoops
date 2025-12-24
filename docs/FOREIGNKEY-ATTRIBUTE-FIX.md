# ForeignKey Attribute Fix - Root Cause Analysis

**Date:** 2025-12-24
**Issue:** Player registration 500 error in develop environment
**Root Causes:** Two separate configuration issues

---

## Problem 1: Table Name Mismatch ✅ FIXED

### Error Message
```
Invalid object name 'Player'.
```

### Root Cause
**File:** `hoopsContext.cs:334`

The EF Core configuration was pointing to a table named `Player` (singular), but the actual database table is `Players` (plural).

```csharp
// BEFORE (Incorrect)
entity.ToTable("Player");

// AFTER (Fixed)
entity.ToTable("Players");
```

### Why This Happened
Likely a typo or inconsistency when the DbContext was initially scaffolded or manually created. The database has always been `Players`, but the EF configuration didn't match.

---

## Problem 2: ForeignKey Attribute Misuse ✅ FIXED

### Error Messages
```
Invalid column name 'DivisionID1'.
Invalid column name 'PeopleID1'.
Invalid column name 'SeasonID1'.
Invalid column name 'TeamID1'.
```

### Root Cause
The `[ForeignKey]` attributes were referencing **database column names** instead of **C# property names**.

### What Are Shadow Properties?
When EF Core sees a `[ForeignKey]` attribute with a name it can't find as a property, it creates a **shadow property** (a column that exists in the database mapping but not in your C# class). EF adds a "1" suffix to avoid naming conflicts, hence `PeopleID1`, `DivisionID1`, etc.

### The Pattern of the Problem

**WRONG WAY** (What you had):
```csharp
[Column("PeopleID")]
public int PersonId { get; set; }  // ← C# property name

[ForeignKey("PeopleID")]  // ← ❌ References column name, not property!
public virtual Person Person { get; set; }
```

**RIGHT WAY** (What it should be):
```csharp
[Column("PeopleID")]
public int PersonId { get; set; }  // ← C# property name

[ForeignKey("PersonId")]  // ← ✅ References C# property name
public virtual Person Person { get; set; }
```

### Rule of Thumb
The `[ForeignKey]` attribute should **always** reference:
- The **C# property name** (PascalCase like `PersonId`)
- **NOT** the database column name (like `PeopleID`)

The `[Column]` attribute already handles the mapping to database column names.

---

## Files Fixed

### 1. Player.cs ✅
**Lines:** 53-60

```csharp
// BEFORE
[ForeignKey("PeopleID")]
public virtual Person Person { get; set; }
[ForeignKey("DivisionID")]
public virtual Division Division { get; set; }
[ForeignKey("TeamID")]
public virtual Team Team { get; set; }
[ForeignKey("SeasonID")]
public virtual Season Season { get; set; }

// AFTER
[ForeignKey("PersonId")]
public virtual Person Person { get; set; }
[ForeignKey("DivisionId")]
public virtual Division Division { get; set; }
[ForeignKey("TeamId")]
public virtual Team Team { get; set; }
[ForeignKey("SeasonId")]
public virtual Season Season { get; set; }
```

### 2. Coach.cs ✅
**Line:** 25

```csharp
// BEFORE
[ForeignKey("PeopleID")]

// AFTER
[ForeignKey("PersonId")]
```

### 3. SponsorPayment.cs ✅
**Line:** 27

```csharp
// BEFORE
[ForeignKey("SponsorProfileID")]

// AFTER
[ForeignKey("SponsorProfileId")]
```

### 4. SchedulePlayoff.cs ✅
**Line:** 15

```csharp
// BEFORE
[ForeignKey("Location")]  // ← Invalid: Location is not a property
public int? LocationNumber { get; set; }

// AFTER
public int? LocationNumber { get; set; }  // ← Removed invalid attribute
```

### 5. hoopsContext.cs ✅
**Line:** 334

```csharp
// BEFORE
entity.ToTable("Player");

// AFTER
entity.ToTable("Players");
```

### 6. PlayerFunctions.cs ✅
**Line:** 163-164

Added inner exception logging to help diagnose future issues:
```csharp
var innerException = ex.InnerException != null ? $"\nInner Exception: {ex.InnerException.Message}" : "";
await errorResp.WriteStringAsync($"Error creating player: {ex.Message}{innerException}\n{ex.StackTrace}");
```

---

## Why This Happened

### Historical Context
This codebase appears to have been:
1. Initially scaffolded from an existing database using EF Core's reverse engineering
2. Some manual edits were made to the generated models
3. The `[ForeignKey]` attributes were likely added manually with database column names instead of property names
4. The table name for Player was manually changed at some point but set to singular instead of matching the database

### Common Misconception
Many developers confuse what `[ForeignKey]` should reference:
- ❌ **Wrong thinking:** "This foreign key points to the `PeopleID` column, so I'll use `[ForeignKey("PeopleID")]`"
- ✅ **Correct thinking:** "This navigation property uses the `PersonId` property as its foreign key, so I'll use `[ForeignKey("PersonId")]`"

---

## How to Prevent This

### 1. Use EF Core Conventions
If you follow naming conventions, you don't need `[ForeignKey]` attributes at all:

```csharp
// Convention-based (no attributes needed!)
public int PersonId { get; set; }
public virtual Person Person { get; set; }
```

EF Core automatically detects `PersonId` as the foreign key for the `Person` navigation property.

### 2. If You Must Use Attributes
Always reference the **C# property name**, not the database column name:
```csharp
[ForeignKey(nameof(PersonId))]  // ← Use nameof() for compile-time safety
public virtual Person Person { get; set; }
```

### 3. Configure in Fluent API Instead
Use `hoopsContext.cs` for all configuration instead of attributes:
```csharp
modelBuilder.Entity<Player>(entity =>
{
    entity.HasOne(p => p.Person)
          .WithMany()
          .HasForeignKey(p => p.PersonId);
});
```

### 4. Review Code Generated by Scaffolding
When scaffolding from an existing database, always review the generated code for these issues.

---

## Testing the Fix

### Build Status
✅ Solution builds successfully
✅ No compilation errors
⚠️ 17 warnings (unrelated to this fix)

### Next Steps to Verify
1. Deploy updated Functions app to develop environment
2. Test player registration form
3. Verify no "Invalid column name" errors
4. Verify player is saved successfully

### Deployment Command
```bash
cd src/Hoops.Functions
func azure functionapp publish <your-dev-function-app-name>
```

---

## Summary

**What was broken:**
1. Table mapping: `Player` → should be `Players`
2. Foreign key attributes: Using column names → should use property names

**What we fixed:**
- ✅ Updated `hoopsContext.cs` table mapping for Player
- ✅ Fixed 4 models with incorrect `[ForeignKey]` attributes
- ✅ Added better error logging for future debugging
- ✅ Documented the pattern for future developers

**Impact:**
- Player registration should now work
- No more shadow property errors
- Better error messages for future issues
- Prevents similar issues in other entities

**Recommendation:**
Consider a future cleanup task to:
1. Remove all `[ForeignKey]` attributes and rely on EF conventions
2. Move all configuration to Fluent API in `hoopsContext.cs`
3. Review all entity models for similar issues
