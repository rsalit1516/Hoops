# Database Table Naming Conventions

**Date:** 2025-12-24
**Status:** Recommendation

## Current State

Your database has a **mix of singular and plural** table names:

### Plural Tables (Majority)
- `Players` ✅
- `People` ✅
- `Divisions` ✅
- `Teams` ✅
- `Users` ✅
- `Seasons` ✅
- `Sponsors` ✅
- `Directors` ✅
- `Households` ✅
- `Colors` ✅
- `Rolls` (Roles) ✅
- `ScheduleGames` ✅
- `SchedulePlayoffs` ✅
- `ScheduleDivTeams` ✅

### Singular Tables (Minority)
- `Coach` ⚠️
- `Company` ⚠️
- `SponsorFee` ⚠️
- `SponsorPayment` ⚠️
- `SponsorProfile` ⚠️
- `Location` (maps to `ScheduleLocations`) ⚠️

## Best Practice Recommendations

### Industry Debate

There are two schools of thought:

**Team Plural:**
- Tables represent collections of entities
- SQL: `SELECT * FROM Users` reads naturally
- Used by: Rails, Laravel, many ORMs by default

**Team Singular:**
- Tables represent entity types
- Each row is a single entity
- SQL: `SELECT * FROM User WHERE UserId = 1` reads naturally
- Used by: Some Microsoft conventions, older standards

### My Recommendation for Hoops

**Stick with PLURAL** for these reasons:

1. **Majority Rules**: ~80% of your tables are already plural
2. **Less Work**: Minimal changes needed
3. **Consistency**: Easier for new developers to predict table names
4. **Modern Convention**: Aligns with most modern frameworks

## Implementation Strategy

### DO NOT Do a Big-Bang Rename ❌

Renaming all tables at once would:
- Break existing code
- Require extensive testing
- Risk production outages
- Create merge conflicts

### DO Follow a Gradual Migration Strategy ✅

**Phase 1: Document Current State (Today)**
- ✅ Document all singular tables
- ✅ Add comments in code marking them for future migration
- ✅ Establish plural as the standard going forward

**Phase 2: Fix on Touch (Ongoing)**
- When you work on a feature that touches a singular table
- Rename the table as part of that feature work
- Create an EF migration for the rename
- Update all references in that context

**Phase 3: Low-Hanging Fruit (Optional)**
- Tables with minimal dependencies can be renamed opportunistically
- Always use EF migrations to track changes

## How to Rename a Table (When Ready)

### Step 1: Create EF Migration
```bash
dotnet ef migrations add RenameCoachToCoaches --project src/Hoops.Infrastructure --startup-project src/Hoops.Api
```

### Step 2: Edit the Migration
```csharp
protected override void Up(MigrationBuilder migrationBuilder)
{
    migrationBuilder.RenameTable(
        name: "Coach",
        newName: "Coaches");
}

protected override void Down(MigrationBuilder migrationBuilder)
{
    migrationBuilder.RenameTable(
        name: "Coaches",
        newName: "Coach");
}
```

### Step 3: Update hoopsContext.cs
```csharp
modelBuilder.Entity<Coach>(entity =>
{
    entity.ToTable("Coaches"); // Changed from "Coach"
    // ... rest of configuration
});
```

### Step 4: Test Thoroughly
- Run all unit tests
- Test affected features manually
- Verify foreign keys still work
- Check all queries in repositories

### Step 5: Deploy with Migration
- Apply migration to dev
- Test in dev
- Apply to production during deployment

## Quick Reference: Singular Tables to Eventually Rename

| Current Name | Recommended Name | Priority | Reason |
|--------------|------------------|----------|--------|
| Coach | Coaches | Low | Low usage |
| Company | Companies | Medium | Referenced in multiple places |
| SponsorFee | SponsorFees | Medium | Part of sponsor system |
| SponsorPayment | SponsorPayments | Medium | Part of sponsor system |
| SponsorProfile | SponsorProfiles | Medium | Part of sponsor system |

## Going Forward: New Tables

**All new tables MUST use plural names:**
- `NewFeatures` not `NewFeature`
- `Notifications` not `Notification`
- `PlayerStats` not `PlayerStat`

## The Fix We Just Made

**Today's fix:**
- Changed EF mapping from `entity.ToTable("Player")` → `entity.ToTable("Players")`
- **No database changes needed** - we matched the code to the existing database
- This is the **correct** approach when code and database are out of sync

**Line changed:** `hoopsContext.cs:334`

## Summary

**Short Answer:**
- ✅ Keep plural naming (it's your current standard)
- ❌ Don't rename everything now (too risky)
- ✅ Fix EF mappings to match database (what we just did)
- ✅ Gradually rename singular tables as you touch them
- ✅ All new tables use plural names

**The pragmatic approach:** Work with what you have, improve gradually, stay consistent.
