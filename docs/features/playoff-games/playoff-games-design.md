# Playoff Games - Components

## Frontend Components
### Existing
- playoff-shell.component.ts - wrapper for playoffs
- schedule-playoffs.component.ts - wrapper for list
- daily-playoff-schedule.component.ts
- playoff-game.service.ts - service for retrieving playoff games
- games-top-menu.component.ts - top level filtering and links for regular season games, standings, playoff games and division selection.
- games-shell.component.ts - overall games wrapper for regular season games, standings and, playoff games.
- games-routing.module.ts - routing for regular season games, standings, playoff games.

## Backend Components
### Existing
- SchedulePlayoffController.cs
- SchedulePlayoffRepository.cs

### To Be Built
- SchedulePlayoffService.cs - if we use the service pattern between controller and repository following the aggregate root design.
