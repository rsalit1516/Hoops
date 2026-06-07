# Database & Frontend Refactoring — June 2026

## Overview

Six branches were created off `develop` as part of a database cleanup, normalization, and audit-trail initiative. They must be merged **in order** — each migration depends on the previous one having been applied to the database.

---

## Merge Order

| # | Branch | Migration(s) | Description |
|---|--------|--------------|-------------|
| 1 | `db/phase0-angular22-guidance` | none | Angular 22 CLAUDE.md guidance update |
| 2 | `db/phase1-cleanup-frontend` | none | Remove orphaned legacy code |
| 3 | `db/phase2-remove-sponsorfee` | none | Remove dead SponsorFee code |
| 4 | `db/phase3-legacy-columns` | `RemoveLegacyColumns` | Drop redundant/legacy DB columns |
| 5 | `db/phase4-companyid-cleanup` | `RemoveCompanyIdFromDivPlayerTeam` | Drop CompanyID from 3 tables |
| 6 | `db/phase5-audit-fields` | `CompleteAuditFields` | Extend audit trail to all tables |

After merging each branch to `develop`: deploy to dev, run `dotnet ef database update`, smoke-test, then proceed to the next.

---

## What Each Phase Does

### Phase 0 — `db/phase0-angular22-guidance`
**No DB changes. No migration.**

Updates `hoops.ui/CLAUDE.md` with Angular 22 best practices:
- Removes the `standalone: true` requirement (default since Angular v20)
- Adds guidance for `input()`/`output()` functions, `host` object bindings, native `@if`/`@for`/`@switch` control flow, `class`/`style` bindings over `ngClass`/`ngStyle`, `NgOptimizedImage`, `inject()` for services, WCAG AA accessibility, and signal mutation rules (`set()`/`update()` only — no `mutate()`)

---

### Phase 1 — `db/phase1-cleanup-frontend`
**No DB changes. No migration.**

Deletes `hoops.ui/src/admin/director/` — the old module-based director feature that was replaced by `admin/admin-directors/` (standalone components) but never removed. The folder was not imported by any route and served no purpose.

---

### Phase 2 — `db/phase2-remove-sponsorfee`
**No DB changes. No migration.**

Removes all SponsorFee dead code. The `SponsorFee` table was marked `ExcludeFromMigrations()` and never existed in the database — the repository returned a hardcoded in-memory list of three fee tiers.

**Removed:**
- `SponsorFee.cs` model, `ISponsorFeeRepository`, `SponsorFeeRepository`, `SponsorFeeFunctions`, `SponsorFeeDto`
- `DbSet<SponsorFee>` and entity configuration from `hoopsContext.cs`
- DI registration from `ServiceCollectionExtensions`

**Frontend:** `AdminSponsorService.loadFees()` no longer makes an HTTP call. The three hardcoded fees (Standard $225, Discount $112.50, Scholarship $0) are now a module-level constant in the service. `GET_SPONSOR_FEES_URL` removed from `Constants`.

---

### Phase 3 — `db/phase3-legacy-columns`
**Migration: `RemoveLegacyColumns`**

Drops 14 redundant or legacy columns across 6 tables:

| Table | Columns Dropped | Reason |
|-------|-----------------|--------|
| `Teams` | `Round1`–`Round8` | Unused tournament experiment; never normalized |
| `Teams` | `TeamColor` (text) | Redundant with `TeamColorID` FK; kept as `[NotMapped]` C# property for display |
| `Sponsors` | `Color1`, `Color2` (text) | Redundant with `Color1ID`, `Color2ID` FKs |
| `Players` | `Coach` (bare int) | Duplicate of `CoachID` FK |
| `Players` | `Sponsor` (bare int) | Duplicate of `SponsorID` FK |
| `People` | `TEMPID` | Temporary data-migration artifact |
| `Households` | `TEMID` | Temporary data-migration artifact |
| `Comments` | Renames `CreatedUSer` → `CreatedUser` | Fixes typo in column name |

Also drops 3 composite indexes that referenced the removed `Coach` and `Sponsor` columns on `Players`.

**Backend changes:** C# models, `hoopsContext` entity configs, `PlayerDto`, `EntityMapper`, and `PlayerRepository` updated throughout.

**Frontend changes:** `player.ts` removes bare `coach`/`sponsor` int fields; `person.ts` removes `tempId`.

---

### Phase 4 — `db/phase4-companyid-cleanup`
**Migration: `RemoveCompanyIdFromDivPlayerTeam`**

Drops the `CompanyID` column from three tables where it has no active use:

- `Divisions`
- `Players`
- `Teams`

`CompanyID` is **retained** in all other tables (Coaches, Colors, Companies, Households, People, Seasons, Sponsors, SponsorPayments, SponsorProfile, Users, WebContent) for planned multi-league expansion.

**Note:** On the `develop` branch, `CompanyID` on `Divisions` and `Players` was configured as a shadow property (not exposed on the C# model class). On `Teams` it was already commented out. No model-class changes were needed — only the EF context configs and the migration.

No frontend domain model changes were needed (none of the three Angular domain models had `companyId`).

---

### Phase 5 — `db/phase5-audit-fields`
**Migration: `CompleteAuditFields`**

Completes the audit trail that was started in migration `20260409223259_AddAuditFields`. The existing `AuditInterceptor` + `IAuditable` + `AuthContext` pattern already works for 7 tables; this phase extends it to the remaining 14.

**Before this migration:**

| Status | Tables |
|--------|--------|
| Full audit (IAuditable, int FK) | Division, Player, Season, Team, ScheduleGame, SchedulePlayoff, WebContent |
| Partial (string CreatedUser, no Modified fields) | Coach, Color, Company, Director, Household, Person, Role, SponsorPayment, SponsorProfile, Sponsor, User |
| No audit fields | Location, ScheduleDivTeam, WebContentType |

**After this migration:** all tables have `CreatedDate`, `CreatedUser` (int FK → Users), `ModifiedDate`, `ModifiedUser` (int FK → Users), all wired through `AuditInterceptor`.

**What changed per group:**

*Partial tables (11):* `CreatedUser` type converted from `nvarchar` to `int` (nullable FK to `Users.UserID`). `ModifiedDate` and `ModifiedUser` columns added. FK constraints created. C# models implement `IAuditable`.

*No-audit tables (3):* All four audit columns added. C# models implement `IAuditable`.

**Data migration note:** Existing string values in `CreatedUser` columns (legacy usernames) are set to `NULL` on migration — they cannot be resolved to integer User IDs.

**Backend changes:** All 14 C# entity models, `hoopsContext` entity configs, `PersonDto`, `EntityMapper`, seeder files (string `CreatedUser` assignments replaced — `AuditInterceptor` sets these automatically now), `DirectorRepositoryTest`, `UserAutoIncrementTest`.

**Frontend changes:** Audit fields added to `color.ts`, `director.ts`, `division.ts`, `household.ts`, `location.ts`, `person.ts` (createdUser type changed from `string` to `number | null`), `player.ts`, `season.ts`, `sponsor-profile.ts` (SponsorProfile + SponsorPayment interfaces), `user.ts`, `webContent.ts`, `webContentType.ts`.

---

## What Was Deliberately Left Out

These items were scoped out and recorded as future stories:

| Item | Reason deferred |
|------|-----------------|
| `ScheduleDivTeams` table removal | Still used in schedule import; revisit when migrating to the custom scheduler |
| `Companies` table | Planned for multi-league expansion |
| `Rolls` (Roles) table | Planned usage; re-evaluate at Entra ID migration |
| `Users.PWord` column | Keep until Entra migration |
| CompanyID on all other tables | Retained for future multi-league use |
| `People` role flags (13 booleans → junction table) | Major refactor tied to Entra migration |
| `People.LatestSeason/ShirtSize/Rating` | Replace with runtime queries; separate story |
| `Teams.Round1–Round8` (data) | Columns dropped; any historical data was already lost |
| `SchedulePlayoffs` free-text team names | Requires playoff bracket redesign |
| Audit footer in admin UI | Implement after migrations are deployed and verified |

---

## Verification Steps (per branch)

After merging to `develop` and deploying:

1. `dotnet build Hoops.sln` — no errors
2. `dotnet test --filter TestCategory!=Slow` — all pass
3. `dotnet ef database update` — migration applies cleanly
4. Smoke-test affected admin screens
5. `cd hoops.ui && npm run build` — no errors
6. `cd hoops.ui && npm run test:ci` — all pass

**Audit trail verification (Phase 5 only):**
- Create a new record in any previously-partial table; confirm `CreatedDate` and `CreatedUser` are populated in the DB
- Edit that record; confirm `ModifiedDate` and `ModifiedUser` are updated and `CreatedDate`/`CreatedUser` are unchanged
