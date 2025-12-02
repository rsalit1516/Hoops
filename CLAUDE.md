# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hoops is a youth basketball league management system with a .NET 9 backend API, Azure Functions, and an Angular 20 frontend. The application manages people, households, teams, divisions, seasons, and game scheduling for a basketball league.

## Technology Stack

- **Backend**: .NET 9.0 (C#)
- **Frontend**: Angular 20 with Material Design and Tailwind CSS
- **Database**: SQL Server with Entity Framework Core 9.0
- **State Management**: Transitioning from NgRx to Angular Signals
- **Testing**: xUnit (backend), Jasmine/Karma (frontend)
- **Cloud**: Azure (App Services, Functions, SQL Server)
- **CI/CD**: Azure Pipelines

## Architecture

### Backend Project Structure (Clean Architecture)

The solution follows a layered architecture pattern:

- **Hoops.Core**: Domain entities, interfaces, and models (no dependencies)
- **Hoops.Application**: Business logic and application services
- **Hoops.Infrastructure**: EF Core repositories, data access (`hoopsContext`)
- **Hoops.Data**: Data seeding and initialization
- **Hoops.Api**: ASP.NET Core Web API controllers and startup configuration
- **Hoops.Functions**: Azure Functions for background processing

**Key Patterns:**

- Repository pattern: All repositories implement interfaces from `Hoops.Core.Interface` (e.g., `ISeasonRepository`, `IPersonRepository`)
- Dependency injection: Repositories registered in `ServiceCollectionExtensions.AddHoopsRepositories()`
- Services: Application services in `Hoops.Application` (e.g., `ISeasonService`)

### Frontend Structure (Angular)

Located in `hoops.ui/src/app/`:

- **Feature modules**: `admin/` (people, games), `games/`, `home/`, `user/`, `contacts/`, `photos/`, `club-docs/`
- **Shared**: `shared/` (reusable components), `services/` (data services)
- **State**: Transitioning from `reducers/` (NgRx) to signals-based state management
- **Auth**: Cookie-based authentication with route guards

### Core Domain Model

Key entities and relationships:

- `Person` ↔ `Household` (many-to-one)
- `Season` → `Division` → `Team` → `Player`
- `Division` → `Game` (schedule games and playoff games)
- `Person` → `Player` (one-to-many, across seasons)

## Common Development Commands

### Backend (.NET)

```bash
# Build entire solution
dotnet build Hoops.sln

# Run tests (excluding slow tests)
dotnet test --filter TestCategory!=Slow

# Run all tests
dotnet test Hoops.sln

# Run specific test project
dotnet test tests/Hoops.Api.Tests/Hoops.Api.Tests.csproj

# Restore NuGet packages
dotnet restore Hoops.sln

# Run API locally (from src/Hoops.Api)
cd src/Hoops.Api
dotnet run

# Publish Functions
dotnet publish src/Hoops.Functions/Hoops.Functions.csproj -c Release
```

### Frontend (Angular)

```bash
cd hoops.ui

# Install dependencies
npm ci

# Start local development server
npm start
# or
npm run start  # Uses 'local' configuration (localhost:4200)

# Build for production
npm run build
# or
npm run build:prod

# Build for staging
npm run build:staging

# Run tests
npm test

# Run tests in CI mode (headless)
npm run test:ci

# Lint TypeScript files
npm run lint
```

### Database Migrations (EF Core)

```bash
# Add migration (from solution root or src/Hoops.Infrastructure)
dotnet ef migrations add MigrationName --project src/Hoops.Infrastructure --startup-project src/Hoops.Api

# Apply migrations to database
dotnet ef database update --project src/Hoops.Infrastructure --startup-project src/Hoops.Api

# Generate migration script
dotnet ef migrations script --project src/Hoops.Infrastructure --startup-project src/Hoops.Api
```

## Testing Requirements

### Backend Testing

- **Framework**: xUnit
- **Location**: `tests/` folder (e.g., `Hoops.Api.Tests`, `Hoops.Infrastructure.Tests`)
- **Pattern**: Each repository has a `{RepositoryName}Test.cs` class
- **Database**: Use EF Core in-memory database with `TestDatabaseFixture`
- **Structure**: Follow Arrange-Act-Assert pattern
- **Attributes**: `[Fact]` for single tests, `[Theory]` for parameterized tests
- **Coverage**: All CRUD operations and custom repository methods must have tests
- **CI Requirement**: At minimum, unit tests for all acceptance criteria must pass before merge

### Frontend Testing

- **Framework**: Jasmine with Karma
- **Location**: Colocated `.spec.ts` files in `hoops.ui/src/app`
- **Tools**: Angular TestBed for components/services
- **Focus**: Test observable state changes and DOM updates, not internal implementation
- **DOM**: Use `fixture.detectChanges()` after actions that affect the DOM
- **Coverage**: All components, services, and pipes should have unit tests

## Environment Configuration

### Backend Environments

Configuration files in `src/Hoops.Api/`:

- `appsettings.json` - Base configuration
- `appsettings.Development.json` - Dev environment
- `appsettings.Local.json` - Local development
- `appsettings.Production.json` - Production

Connection strings and secrets loaded from Azure Key Vault in production.

### Frontend Environments

Environment files in `hoops.ui/src/environments/`:

- `environment.ts` - Base
- `environment.local.ts` - Local dev (default)
- `environment.development.ts` - Dev/staging
- `environment.prod.ts` - Production
- `environment.staging.ts` - Staging
- `environment.test.ts` - Testing

Build configurations: `local` (default), `development`, `staging`, `production`

## Authentication & Authorization

- **Backend**: Cookie-based authentication (20-minute sliding window)
  - Cookie name: `hoops.auth`
  - Configured in `Startup.cs` with `CookieAuthenticationDefaults`
  - Policy-based authorization: `[Authorize(Roles = "Admin")]` on controllers
- **Frontend**: Route guards for admin access control in feature modules

## API & Serialization

- **JSON Serialization**: Uses Newtonsoft.Json (configured in `Startup.cs`)
- **Reference Handling**: `ReferenceLoopHandling.Ignore` to prevent circular references
- **Convention**: API uses camelCase for JSON properties
- **Swagger**: Available at root (`/`) when running API locally
- **CORS**: Configured for localhost:4200 and production domains

## CI/CD Pipeline

Azure Pipelines configuration in `azure-pipelines.yml`:

**Build & Test Stage:**

1. Restore and build .NET solution (Release config)
2. Run fast backend tests (`--filter TestCategory!=Slow`)
3. Install npm dependencies and build Angular app
4. Run Angular tests in CI mode
5. Publish test results and code coverage

**Deploy Stage:**

- Publishes Azure Functions to dev/prod based on branch
- Branch mapping: `develop` → dev environment, `master`/`main` → prod

## Documentation & Project Management

### Epic and Story Management

The project uses a structured epic/story tracking system in `docs/`:

- **Epics**: Documented in `docs/epics/` with standardized IDs (e.g., `APM-045`, `AGM-001`)
- **Stories**: Tracked in `docs/stories/` with type-based IDs (e.g., `APMF-001` for features, `APMB-001` for bugs)
- **Registry**: `docs/registry/epics.md` maintains active, planned, and completed epics
- **Automation**: Use scripts in `scripts/` to generate IDs and create documentation:
  - `./scripts/generate-epic-id.sh APM` - Generate next epic ID
  - `./scripts/create-epic.sh APL-001 "Title"` - Create epic with template
  - `./scripts/generate-story-id.sh APM feature "Title"` - Generate story ID
  - `./scripts/create-story.sh APMF-001 "Title"` - Create story with BDD template

**Product Area Codes:**

- `APM` - Admin People Management
- `AGM` - Admin Game Management
- `AHM` - Admin Household Management
- `APL` - Admin Player Management
- `PLY` - Playoff Management
- `USR` - User Management
- `RPT` - Reports & Analytics
- `SYS` - System Administration
- `INF` - Infrastructure & DevOps

### Documentation Structure

- **Architecture**: `docs/architecture-overview.md` - System design and ER diagrams
- **Features**: `docs/features/` - BDD feature files with Gherkin scenarios
- **User Stories**: `docs/user-stories/` - Agile stories with acceptance criteria
- **Testing**: `docs/testing/` - Test specifications and strategy
- **Technical**: `docs/technical-requirements.md` - Functional and non-functional requirements
- **Templates**: `docs/templates/` - Templates for epics, stories, and BDD features

## Key Development Notes

### Database Context

- Primary DbContext: `hoopsContext` (lowercase 'h') in `Hoops.Infrastructure.Data`
- Connection string key: `"hoopsContext"`
- Registered with retry logic (5 retries, 10-second delay)

### Frontend State Management

- **Current**: Mixture of NgRx (in `reducers/`) and newer signal-based services
- **Direction**: Transitioning to Angular Signals for state management
- When adding new features, prefer signals over NgRx

### Angular Material & Styling

- Use Angular Material components for UI elements
- Use Tailwind CSS for layout and formatting
- Styles in `hoops.ui/src/Content/styles.scss`
- Style preprocessor includes `src/Content` path

### Azure Best Practices

Per `.github/copilot-instructions.md`: When generating Azure-related code or running Azure terminal commands, follow Azure best practices.

## Main Branch

- The main branch is `master`
- PRs should typically target `master`
- Current branch: `doc-updates` (documentation work in progress)

## Important File Locations

- Solution file: `Hoops.sln`
- Backend: `src/`
- Tests: `tests/`
- Frontend: `hoops.ui/`
- Database scripts: `SQL/`
- Documentation: `docs/`
- Automation scripts: `scripts/`
