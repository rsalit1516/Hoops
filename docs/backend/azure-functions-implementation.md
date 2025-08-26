# Azure Functions Implementation and DTO Design

This document summarizes our migration from the legacy ASP.NET Web API to Azure Functions (isolated worker, .NET 9) and documents the purpose and design of the Data Transfer Objects (DTOs) used to avoid JSON serialization cycles and to provide stable, camelCase payloads for the Angular frontend.

## Overview

- Runtime: Azure Functions isolated worker (Function Runtime v4), .NET 9.
- JSON: System.Text.Json with camelCase naming, case-insensitive reads, and null-value omission.
- Hosting (local): http://localhost:7071
- Frontend integration: Angular 20 uses `environment.functionsUrl` (via `Constants.FUNCTIONS_BASE_URL`) for migrated endpoints.
- Migration status: Season, WebContent, WebContentType, Color, Location, Division, Team, Auth, and User endpoints implemented. Public GETs are AuthorizationLevel.Anonymous during migration.

## Core Configuration

We use explicit JSON serialization when writing responses to ensure consistent options across functions:

- `PropertyNamingPolicy = JsonNamingPolicy.CamelCase`
- `PropertyNameCaseInsensitive = true`
- `DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull`

Typical helper (per function class):

```
private static async Task WriteJsonAsync<T>(HttpResponseData resp, T payload, HttpStatusCode status = HttpStatusCode.OK)
{
  resp.StatusCode = status;
  resp.Headers.Add("Content-Type", "application/json; charset=utf-8");
  await JsonSerializer.SerializeAsync(resp.Body, payload, JsonOptions);
}
```

This guarantees camelCase payloads that match the Angular expectations (e.g., `seasonId`, not `SeasonId`).

## Routing and Auth

- Route style preserves capitalized segments for compatibility with the existing frontend: e.g., `/api/Team/GetSeasonTeams/{seasonId:int}`, `/api/Division/GetSeasonDivisions/{seasonId:int}`.
- Public read endpoints (GET) are currently `[AuthorizationLevel.Anonymous]` to simplify the migration. Write operations (POST/PUT/DELETE) use `[AuthorizationLevel.Function]` and should be protected before production cutover.
- Swagger/OpenAPI endpoints are exposed for discovery and testing: `/api/openapi/{version}.{extension}`, `/api/swagger/ui`.

## Functions Implemented

### SeasonFunctions

- `GET /api/Season/GetCurrentSeason/{companyId?}` → returns current season (camelCase).
- Other CRUD routes mirrored for compatibility.

### DivisionFunctions

- `GET /api/Division` and `GET /api/Division/{id}`
- `GET /api/Division/GetSeasonDivisions/{seasonId}`
  - Uses repository query (`GetSeasonDivisionsAsync`) to avoid traversing navigation properties.
- `POST /api/Division`, `PUT /api/Division/{id}`, `DELETE /api/Division/{id}`
  - Normalizes director IDs (0 → null). Returns 409 on FK constraint issues.

### TeamFunctions

- `GET /api/Team` and `GET /api/Team/{id}`
- `GET /api/Team/GetSeasonTeams/{seasonId}`
- `POST /api/Team`, `PUT /api/Team/{id}`, `DELETE /api/Team/{id}`
- Utility endpoints for schedule mapping:
  - `GET /api/Team/GetMappedTeamNumber/{scheduleNumber}/{teamNumber}`
  - `GET /api/Team/GetMappedTeamNumber/{scheduleNumber}/{teamNumber}/{seasonId}`
  - `GET /api/Team/GetValidScheduleTeams/{scheduleNumber}/{seasonId}`

All Team responses return DTOs (below) to eliminate EF navigation cycles.

### WebContentFunctions / WebContentTypeFunctions

- CRUD parity with legacy controllers. Active content endpoint retained at `/api/webcontent/getActiveWebContent`.

### ColorFunctions, LocationFunctions

- Read endpoints migrated with camelCase payloads.

### AuthFunctions, UserFunctions

- Interim endpoints (e.g., `/api/auth/me`, `/api/auth/login`) to maintain compatibility.
- JWT/Entra integration is deferred; to be standardized prior to production.

## Why DTOs?

Entity Framework entities include navigation properties (e.g., Team → Division → Teams → Division ...), which can create reference cycles. Returning EF entities directly caused `System.Text.Json.JsonException: A possible object cycle was detected`. DTOs solve this by:

- Flattening the shape to only required fields for the UI.
- Avoiding navigation properties.
- Providing a stable, versionable contract between backend and frontend.

### TeamDto

Purpose: Represent a Team in a minimal, cycle-free structure consumed by Angular lists, menus, and schedule features.

Fields:

- `teamId` (number)
- `divisionId` (number)
- `seasonId` (number)
- `teamColorId` (number)
- `teamName` (string)
- `name` (string) – alias for `teamName` to match legacy frontend usage
- `teamNumber` (string | number) – preserved as stored
- `createdDate` (Date)
- `createdUser` (string)

Mapping example (projection):

```
private static TeamDto ToDto(Team t) => new TeamDto
{
  TeamId = t.TeamId,
  DivisionId = t.DivisionId,
  SeasonId = t.SeasonId,
  TeamColorId = t.TeamColorId,
  TeamName = t.TeamName,
  Name = t.TeamName,
  TeamNumber = t.TeamNumber,
  CreatedDate = t.CreatedDate,
  CreatedUser = t.CreatedUser
};
```

Endpoints projecting to DTOs:

- `GetTeams`, `GetTeamById`, `GetSeasonTeams`, `PostTeam` (response), `DeleteTeam` (response)

### Future DTOs

- If any other endpoints surface cycles or oversized payloads (e.g., Division with Teams/Players), introduce corresponding DTOs.
- Follow the same pattern: keep scalar keys/attributes, drop navigation properties, add aliases needed by the UI.

## Angular Integration Notes

- Base URLs come from `Constants.FUNCTIONS_BASE_URL` (populated via `environment.functionsUrl`).
- Key constants updated:
  - `SEASON_DIVISIONS_URL = {functionsUrl}/api/Division/GetSeasonDivisions/`
  - `GET_SEASON_TEAMS_URL = {functionsUrl}/api/Team/GetSeasonTeams/`
  - Team write endpoints: `{functionsUrl}/api/Team` and `{functionsUrl}/api/Team/{id}`
- Services guard for async season state to avoid `undefined` access at init time.

## Error Handling and Status Codes

- `400 BadRequest`: invalid IDs or parameters (e.g., non-positive seasonId).
- `404 NotFound`: entity not found.
- `409 Conflict`: FK constraint or domain conflict (e.g., delete division with dependent data).
- `201 Created`: on successful `POST` with created body.

## Security

- During migration, public GETs are anonymous to simplify testing.
- Before production, switch to appropriate authorization (JWT/Entra) and apply consistent auth to both controller-style endpoints and Functions.
- CORS configured to allow local dev origin with credentials.

## Testing and Validation

- Solution builds cleanly; fast test suite passes.
- Local smoke checks demonstrate camelCase payloads and DTO projection correctness.
- Swagger UI at `/api/swagger/ui` for manual exploration.

## Operational Notes

- Worker SDK warning (NU1603) is benign; consider pinning Microsoft.Azure.Functions.Worker.Sdk to 2.x to silence.
- Keep route capitalization stable to reduce frontend churn.
- Prefer repository methods that return flat or minimally-related data when DTOs are not used.

## Next Steps

1. Audit other endpoints for potential cycles; add DTOs as needed.
2. Standardize authentication and authorization across all Functions.
3. Add integration tests for Functions endpoints covering DTO shapes and status codes.
4. Consider OpenAPI annotations for DTO schemas to improve Swagger docs.
