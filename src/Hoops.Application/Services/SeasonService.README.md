# SeasonService: Domain Service (Aggregate Root)

## Purpose
The `SeasonService` acts as the aggregate root for all business logic and orchestration related to sports seasons in the Hoops application. It coordinates repository calls, applies domain rules, and exposes methods for use by controllers and other application layers.

## Responsibilities
- Encapsulate all season-related business logic.
- Orchestrate calls to one or more repositories as needed.
- Apply domain rules (e.g., only one current season per company, validation on create/update).
- Expose methods for querying and modifying season data.
- Serve as the main entry point for season operations from controllers.

## Example Methods
- `GetAllSeasonsAsync(companyId)` — Returns all seasons for a company.
- `GetCurrentSeasonAsync(companyId)` — Returns the current active season for a company.
- `GetSeasonByIdAsync(companyId, seasonId)` — Returns a specific season by ID.
- `CreateSeasonAsync(season)` — Creates a new season, applying business rules.
- `UpdateSeasonAsync(season)` — Updates an existing season, applying business rules.
- `DeleteSeasonAsync(seasonId)` — Deletes a season, applying business rules.

## DDD/Service Layer Pattern
- The service layer should not expose repository details to controllers.
- All orchestration and business logic should be in the service, not the controller.
- Use dependency injection for repositories.
- Service methods should be focused, testable, and return domain objects or DTOs.

## Example Usage
```csharp
// In controller:
var currentSeason = await _seasonService.GetCurrentSeasonAsync(companyId);
```

## Testing
- Use in-memory or mocked repositories to isolate service logic.
- Test business rules, orchestration, and aggregate behaviors.
- Avoid testing repository internals (covered by repository tests).
- Use Arrange-Act-Assert pattern for clarity.

## Next Steps
1. Implement additional methods in SeasonService as described above.
2. Add tests for each public method, focusing on business logic and orchestration.
3. Use dependency injection for repositories.
4. Keep service methods focused and testable.
