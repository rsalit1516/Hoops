# CLAUDE.md — Backend (src/)

This file provides .NET-specific guidance for the `src/` directory. For cross-cutting project rules see the root `CLAUDE.md`.

## Technology

- .NET 9.0 (C#)
- Azure Functions v4 (isolated worker) — **primary HTTP API**
- Entity Framework Core 9.0
- xUnit (testing)

## Architecture — Clean Architecture

The solution follows strict layered Clean Architecture. **Respect dependency direction at all times** — inner layers never reference outer layers.

| Project                | Responsibility                                     | Dependencies                |
| ---------------------- | -------------------------------------------------- | --------------------------- |
| `Hoops.Core`           | Domain entities, interfaces, models                | None                        |
| `Hoops.Application`    | Business logic, application services               | Core only                   |
| `Hoops.Infrastructure` | EF Core, repositories, data access                 | Core, Application           |
| `Hoops.Data`           | Data seeding and initialization                    | Infrastructure              |
| `Hoops.Functions`      | **Primary HTTP API** — Azure Functions v4 (isolated worker) | Application, Infrastructure |
| `Hoops.Api`            | Legacy ASP.NET Core API — **being decommissioned** | All layers                  |

> **Note:** `Hoops.Functions` is the active backend. `Hoops.Api` is kept in source for reference during decommission but is no longer deployed via CI/CD. New endpoints go in `Hoops.Functions`.

## Key Patterns

### Repository Pattern

- All repositories implement interfaces defined in `Hoops.Core.Interface`
- Examples: `ISeasonRepository`, `IPersonRepository`, `ITeamRepository`
- Repositories are registered via `ServiceCollectionExtensions.AddHoopsRepositories()` in `Hoops.Infrastructure`
- **NEVER** access `hoopsContext` directly from `Hoops.Application` — always go through a repository interface

### Dependency Injection

- All services and repositories registered through DI — no `new` instantiation of services
- Application services live in `Hoops.Application` (e.g., `ISeasonService`)
- Register new repositories in `ServiceCollectionExtensions.AddHoopsRepositories()`
- Register new application services in the appropriate `ServiceCollectionExtensions` method

### Database Context

- Primary DbContext: `hoopsContext` (lowercase 'h') in `Hoops.Infrastructure.Data`
- Connection string key: `"hoopsContext"`
- Registered with retry logic (5 retries, 10-second delay)
- **NEVER** change the DbContext name or connection string key without updating all references

## Authentication (Cookie-Based)

- The `hoops.auth` cookie is **issued by `AuthFunctions.Login`** (Azure Functions), not the legacy `Hoops.Api`
- Cookie value: the authenticated user's `UserId` as a string (e.g., `"42"`)
- `AuthenticationMiddleware` validates the cookie on every request and populates:
  - `context.Items["User"]` — used by `CheckAuthentication()` / `[RequireAuth]`
  - `AuthContext.UserId` (scoped service) — used by functions that need to identify the caller (e.g., `Auth_Me`)
- Cookie attributes: `HttpOnly=true`, `Secure=true` (in production), `SameSite=ExplicitNone` (cross-origin), `MaxAge=20 min`
- In local development, `Secure=false` and `SameSite=Lax` to allow HTTP on `localhost:7071`
- **NEVER** introduce JWT authentication — the system uses cookies only

## Environment Configuration

Configuration files in `src/Hoops.Functions/`:

| File                           | Purpose                 |
| ------------------------------ | ----------------------- |
| `appsettings.json`             | Base configuration      |
| `appsettings.Development.json` | Development environment |
| `local.settings.json`          | Local development (not committed) |

- Connection strings and secrets loaded from **Azure Key Vault** in production
- Never hardcode secrets or connection strings — use Key Vault references
- Toggle `USE_PROD_DATA=true` to read from the production read-only connection string

## Development Commands

```bash
# Build entire solution (from repo root)
dotnet build Hoops.sln

# Restore NuGet packages
dotnet restore Hoops.sln

# Run Functions locally (primary backend)
cd src/Hoops.Functions
func start

# Run Functions locally over HTTPS (required for SameSite=None cookies in browser)
func start --useHttps

# Publish Azure Functions
dotnet publish src/Hoops.Functions/Hoops.Functions.csproj -c Release
```

### Database Migrations (EF Core)

Always run migration commands from the solution root:

```bash
# Add a new migration
dotnet ef migrations add MigrationName \
  --project src/Hoops.Infrastructure \
  --startup-project src/Hoops.Api

# Apply migrations to database
dotnet ef database update \
  --project src/Hoops.Infrastructure \
  --startup-project src/Hoops.Api

# Generate SQL migration script
dotnet ef migrations script \
  --project src/Hoops.Infrastructure \
  --startup-project src/Hoops.Api
```

> `Hoops.Api` is used as the startup project for EF migrations because `Hoops.Functions` (isolated worker) is not compatible with EF design-time tooling.

## Testing Requirements

- **Framework**: xUnit
- **Location**: `tests/` folder (e.g., `Hoops.Api.Tests`, `Hoops.Infrastructure.Tests`)
- **Pattern**: Each repository has a corresponding `{RepositoryName}Test.cs` class
- **Database**: Use EF Core in-memory database via `TestDatabaseFixture` — never use a real database in tests
- **Structure**: Arrange-Act-Assert pattern strictly
- **Attributes**: `[Fact]` for single-case tests, `[Theory]` with `[InlineData]` for parameterized tests
- **Coverage**: All CRUD operations and all custom repository methods must have tests
- **CI requirement**: All unit tests for acceptance criteria must pass before merge

### Running Tests

```bash
# Run all tests except slow integration tests (use for fast feedback)
dotnet test --filter TestCategory!=Slow

# Run all tests including slow tests
dotnet test Hoops.sln

# Run a specific test project
dotnet test tests/Hoops.Api.Tests/Hoops.Api.Tests.csproj

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"
```

## Serialization & API

- **`Hoops.Functions` (active)**: JSON serializer is **System.Text.Json** with `PropertyNamingPolicy = CamelCase`
- **`Hoops.Api` (legacy)**: Used Newtonsoft.Json configured in `Startup.cs` — do not apply to Functions
- All new Functions code uses `System.Text.Json` — do not introduce Newtonsoft in `Hoops.Functions`
