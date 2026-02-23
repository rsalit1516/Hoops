# CLAUDE.md — Backend (src/)

This file provides .NET-specific guidance for the `src/` directory. For cross-cutting project rules see the root `CLAUDE.md`.

## Technology

- .NET 9.0 (C#)
- ASP.NET Core Web API
- Entity Framework Core 9.0
- Azure Functions (background processing)
- xUnit (testing)

## Architecture — Clean Architecture

The solution follows strict layered Clean Architecture. **Respect dependency direction at all times** — inner layers never reference outer layers.

| Project                | Responsibility                       | Dependencies                |
| ---------------------- | ------------------------------------ | --------------------------- |
| `Hoops.Core`           | Domain entities, interfaces, models  | None                        |
| `Hoops.Application`    | Business logic, application services | Core only                   |
| `Hoops.Infrastructure` | EF Core, repositories, data access   | Core, Application           |
| `Hoops.Data`           | Data seeding and initialization      | Infrastructure              |
| `Hoops.Api`            | ASP.NET Core controllers, startup    | All layers                  |
| `Hoops.Functions`      | Azure Functions for background jobs  | Application, Infrastructure |

## Key Patterns

### Repository Pattern

- All repositories implement interfaces defined in `Hoops.Core.Interface`
- Examples: `ISeasonRepository`, `IPersonRepository`, `ITeamRepository`
- Repositories are registered via `ServiceCollectionExtensions.AddHoopsRepositories()` in `Hoops.Infrastructure`
- **NEVER** access `hoopsContext` directly from `Hoops.Api` or `Hoops.Application` — always go through a repository interface

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

## Environment Configuration

Configuration files in `src/Hoops.Api/`:

| File                           | Purpose                 |
| ------------------------------ | ----------------------- |
| `appsettings.json`             | Base configuration      |
| `appsettings.Development.json` | Development environment |
| `appsettings.Local.json`       | Local development       |
| `appsettings.Production.json`  | Production              |

- Connection strings and secrets loaded from **Azure Key Vault** in production
- Never hardcode secrets or connection strings — use Key Vault references

## Development Commands

```bash
# Build entire solution (from repo root)
dotnet build Hoops.sln

# Restore NuGet packages
dotnet restore Hoops.sln

# Run API locally
cd src/Hoops.Api
dotnet run

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

- JSON serializer: **Newtonsoft.Json** (not System.Text.Json) — configured in `Startup.cs`
- Reference loop handling: `ReferenceLoopHandling.Ignore`
- JSON convention: camelCase property names
- Do not switch to `System.Text.Json` without an explicit migration plan
