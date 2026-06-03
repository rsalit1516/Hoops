# Schedule Generator — Feature Specification

**Product Area:** AGM (Admin Game Management)  
**Status:** In Development  
**Last Updated:** 2026-06-02

---

## Overview

The Schedule Generator is an admin-only wizard that automates the creation of regular-season game schedules for one or more divisions. It produces a round-robin schedule constrained by time-slot availability, court assignments, blackout date ranges, per-team weekly game limits, and optional coach-conflict detection. Games are previewed before any data is written; the admin can edit individual games in the preview, save drafts to revisit later, and commit the final schedule to the database in one action.

---

## User Workflow (5-Step Wizard)

### Step 1 — Schedule Parameters

The admin selects the season and configures global scheduling rules:

| Field | Default | Notes |
|-------|---------|-------|
| Season | — | Required. Auto-fills start/end date from season metadata. |
| Start Date | Season start | Earliest date any game can be scheduled. |
| End Date | Season end | Latest date any game can be scheduled. |
| Games per Team | 10 | Total regular-season games each team should play. |
| Max Games per Team per Week | 2 | Hard weekly cap enforced during slot assignment. |
| Game Duration (minutes) | 50 | Used to compute how many time slots fit in a configured window. |
| Enforce Coach Conflict Detection | On | When enabled, warnings are emitted when a coach is double-booked; does not block scheduling. |

Step completes when season, both dates, and all numeric fields are valid.

---

### Step 2 — Select Divisions

The admin selects which divisions in the chosen season to include in this scheduling run. Divisions are loaded asynchronously from the API after the season is chosen in Step 1.

- Multiple divisions can be selected in a single run.
- Deselecting a division automatically removes any time slots configured for it in Step 3.

Step completes when at least one division is selected.

---

### Step 3 — Available Time Periods

This step configures **when and where** each division's games can be scheduled. Configuration is **per division** — different divisions typically play at different facilities or on different days (e.g., youngest divisions play weekend mornings on the mini courts; older divisions play weeknight evenings in the main gym).

Each selected division has its own section. Within a division, the admin adds one or more **time period** rows. Each row represents a recurring block of available court time:

| Field | Description |
|-------|-------------|
| Court / Location | Which court this period applies to (required). |
| Day of Week | The day this period recurs each week. |
| Begin Time / End Time | The window within which games are scheduled on that day. Slots are derived automatically at the configured game-duration interval (e.g., a 3-hour window with 50-minute games yields slots at 6:00 pm, 6:50 pm, 7:40 pm). |

**Key design rules:**
- A division that plays on Gym East, Gym Middle, and Gym West on Tuesday evenings needs three rows (one per court, same day and time window).
- A division that plays on both Saturday and Sunday mornings needs two rows per court (one per day).
- Court occupancy is **cross-division**: if Gym East at 6:00 pm Tuesday is claimed by one division, no other division can be assigned that same slot.
- Periods for a division can be copied from another division to save re-entry.
- A summary line shows the computed individual slots (e.g., "4 slots per court: 6:00 pm · 6:50 pm · 7:40 pm · 8:30 pm").

Step completes when every selected division has at least one time period with a court assigned.

---

### Step 4 — Blackout Dates

The admin adds date **ranges** when games cannot be scheduled, optionally scoped to a specific location. Common examples:

- Gym closed for Thanksgiving holiday weekend (all locations, Nov 27–Dec 1)
- Competing tournament occupying the main gym for a week (Gym East/Middle/West, Oct 15–22)
- Single-day closure (set start date = end date)

| Field | Description |
|-------|-------------|
| Start Date | First date in the blackout range (inclusive). |
| End Date | Last date in the blackout range (inclusive). |
| Location | Which location this blocks. Leave as "All Locations" to block the entire facility. |

Step is optional — no blackout periods are required.

---

### Step 5 — Preview & Commit

The admin generates a draft schedule, reviews and optionally edits it, then commits to the database.

**Generate Preview**  
Calls the backend scheduling algorithm and returns a full list of proposed games with warnings. No data is written at this stage.

**Preview Views**

- **Table view**: Sortable, paginated (25 / 50 / 100 rows per page). Columns: Date, Time, Location, Home Team, Visiting Team, Warnings. Each row has an Edit button.
- **Calendar view**: Monthly calendar. Each day with scheduled games shows a badge count. Clicking a date expands the day's games.

**Filters** (applied locally, no re-generation needed)
- Filter by division (when multiple divisions were included)
- Filter by team (shows only games where the team appears as home or visiting)

**Game Editing**  
Individual games can be edited via a dialog without re-generating the entire schedule. Editable fields: date, start time, location.

**Warnings**  
A warning chip shows the total number of constraint warnings (e.g., coach double-booked). Warning rows are highlighted in the table. Warnings are informational and do not prevent commit.

**Draft System**  
The admin can save the current preview as a named draft to localStorage. Drafts show the name, save timestamp, season, and game count. A draft can be loaded later to resume editing or commit without re-running the algorithm. Multiple drafts can coexist; any draft can be deleted.

**Commit**  
Saves all games in the current preview to the database. Shows a count of games saved and any per-game errors. The Commit button disables after a successful commit to prevent double-submission. The admin can Regenerate the preview (clears the commit state) if changes are needed.

**Form state persistence**  
All configuration inputs (Steps 1–4) are automatically persisted to `localStorage` and restored on next visit, so the admin does not lose work across browser sessions.

---

## Scheduling Algorithm

### Round-Robin Pairing Generation

For each division, the algorithm generates a list of `(home, visiting)` team pairings using a modified round-robin rotation that prevents the same matchup from recurring in every pass until the `gamesPerTeam` target is reached for all teams.

- If the number of teams is odd, a virtual "bye" team is added to balance rounds.
- The rotation is based on a fixed-point / rotating-list algorithm (pin team 0, rotate others).

### Multi-Division Interleaving

When multiple divisions are scheduled in one run, their game lists are interleaved before slot assignment rather than assigned division-by-division. This distributes court demand evenly across the date range and prevents early divisions from consuming all prime-time slots before later divisions are processed.

Pattern: Game 1 of Division A, Game 1 of Division B, Game 1 of Division C, Game 2 of Division A, …

### Slot Assignment (FindNextSlot)

For each game pairing, the algorithm performs a forward search from the season start date:

1. **Skip blacked-out dates** — dates within any configured blackout range (scoped to location or global).
2. **Check weekly game limits** — both home and visiting teams must be under the per-week cap.
3. **Check daily conflict** — neither team may already have a game on this date.
4. **Get eligible courts** — only courts configured for this division on this day-of-week are considered.
5. **Claim a slot** — call `GameTimeSlotManager.ClaimNextSlot(divisionId, date, locationId)` to find the next unclaimed start time on that court.
6. **Return the first successful (date, time, court) triple.**

If no slot is found before the end date, the game is skipped with a log warning.

### Court Occupancy Tracking (`GameTimeSlotManager`)

The slot manager maintains a `(date, locationId) → Set<TimeSpan>` map of claimed times. A slot is unavailable once any game — from any division — has claimed it. This prevents two games from being booked on the same court at the same time regardless of division.

### Constraint Summary

| Constraint | Type | Behavior |
|------------|------|----------|
| Blackout date range | Hard | Date skipped entirely (or location skipped if scoped) |
| Weekly game limit | Hard | Date skipped if either team is at cap |
| Daily conflict | Hard | Date skipped if either team has a game that day |
| Court double-booking | Hard | Court/time slot skipped if already claimed |
| Coach conflict | Soft | Warning added to game; scheduling proceeds |

---

## API Contract

### POST `/schedule-generator/preview`

**Request:** `ScheduleGeneratorRequest`

```json
{
  "seasonId": 5,
  "startDate": "2024-11-01T00:00:00Z",
  "endDate": "2025-03-15T00:00:00Z",
  "divisionIds": [12, 14],
  "gamesPerTeam": 10,
  "maxGamesPerWeekPerTeam": 2,
  "gameDurationMinutes": 50,
  "timeSlots": [
    { "divisionId": 12, "dayOfWeek": 6, "startTime": "09:00:00", "locationId": 3 },
    { "divisionId": 12, "dayOfWeek": 6, "startTime": "09:50:00", "locationId": 3 },
    { "divisionId": 14, "dayOfWeek": 1, "startTime": "18:00:00", "locationId": 1 },
    { "divisionId": 14, "dayOfWeek": 1, "startTime": "18:50:00", "locationId": 1 }
  ],
  "blackoutDates": [
    { "startDate": "2024-11-27", "endDate": "2024-12-01", "locationId": null }
  ],
  "enforceCoachConflicts": true
}
```

**Response:** `ScheduleGeneratorResult`

```json
{
  "success": true,
  "errorMessage": null,
  "games": [
    {
      "divisionId": 12,
      "divisionName": "T2-Coed",
      "scheduleNumber": 12,
      "gameNumber": 1,
      "gameDate": "2024-11-02T09:00:00",
      "gameTime": "1899-12-30 09:00:00",
      "locationNumber": 3,
      "locationName": "Mini Front",
      "homeTeamId": 45,
      "homeTeamName": "Red Rockets",
      "visitingTeamId": 46,
      "visitingTeamName": "Blue Blazers",
      "warnings": []
    }
  ],
  "totalGames": 40
}
```

**Error responses:**
- `422 Unprocessable Entity` — validation failure (no divisions, no time slots, invalid date range)

---

### POST `/schedule-generator/commit`

**Request:** `ScheduleCommitRequest`
```json
{
  "seasonId": 5,
  "games": [ /* array of ScheduleGamePreviewItem from preview response */ ]
}
```

**Response:** `ScheduleCommitResult`
```json
{
  "gamesCreated": 40,
  "errors": []
}
```

**Status codes:**
- `200 OK` — all games saved
- `207 Multi-Status` — partial success; `errors` array contains per-game failure messages

---

## Data Model Reference

### `AvailableTimeSlot`
| Field | Type | Description |
|-------|------|-------------|
| `divisionId` | `int` | Division this slot applies to |
| `dayOfWeek` | `DayOfWeek` | 0=Sun … 6=Sat |
| `startTime` | `TimeSpan` | Slot start time |
| `locationId` | `int` | Court location (required) |

### `ScheduleBlackoutDate`
| Field | Type | Description |
|-------|------|-------------|
| `startDate` | `DateTime` | First day of blackout (inclusive) |
| `endDate` | `DateTime` | Last day of blackout (inclusive) |
| `locationId` | `int?` | Null = all locations |

### `ScheduleGamePreviewItem`
| Field | Type | Description |
|-------|------|-------------|
| `divisionId` / `divisionName` | | Division the game belongs to |
| `scheduleNumber` | `int` | Groups games by division (= divisionId) |
| `gameNumber` | `int` | Sequential within division |
| `gameDate` | `DateTime` | Full date + time |
| `gameTime` | `string` | Legacy `1899-12-30 HH:mm:ss` format for DB compatibility |
| `locationNumber` / `locationName` | | Court |
| `homeTeamId` / `homeTeamName` | | Home team |
| `visitingTeamId` / `visitingTeamName` | | Visiting team |
| `warnings` | `List<string>` | Constraint warnings (e.g., coach conflict) |

---

## Frontend Architecture

### Component Structure

```
AdminScheduleGenerator (shell, providers ScheduleGeneratorStateService)
├── ScheduleParamsStepComponent
├── ScheduleDivisionsStepComponent
├── ScheduleTimePeriodsStepComponent
├── ScheduleBlackoutStepComponent
└── SchedulePreviewStepComponent
```

The shell component owns the `mat-stepper` and injects `ScheduleGeneratorStateService` as a scoped provider. All step components read from and write to the shared state service via signals.

### `ScheduleGeneratorStateService`

Central state container for the entire wizard. Key responsibilities:

- Holds all form inputs as Angular signals
- Loads seasons and divisions from API
- Manages time period and blackout row collections (ID-keyed for stable add/remove)
- Computes derived values (selected divisions, preview group/filter, calendar layout)
- Calls `GameService` for preview and commit
- Persists/restores form state via `localStorage`
- Manages draft save/load/delete

### localStorage Keys

| Key | Contents |
|-----|----------|
| `schedule-generator-settings` | All Step 1–4 inputs; auto-saved on every change |
| `schedule-generator-drafts` | Array of named `ScheduleDraft` objects (preview game lists) |

---

## Known Constraints & Open Items

- **No backend draft persistence** — drafts are stored in the browser only; clearing localStorage loses them. A future enhancement could persist drafts server-side.
- **No partial commit resume** — if a commit partially fails, there is no mechanism to retry only the failed games without re-running the full preview.
- **Coach conflict detection is warning-only** — the algorithm does not attempt to resolve conflicts by picking a different slot; it logs and continues.
- **Interleaving is round-based, not demand-based** — if one division has significantly more teams (and therefore more games) than another, it may still exhaust prime slots later in the season.

---

## Planned Enhancements

*(To be decomposed into Azure DevOps work items under product area `AGM`)*

<!-- Add upcoming stories/tasks here as they are identified -->
