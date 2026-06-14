# CLAUDE.md

This file provides guidance to Claude Code when working with the Hoops repository. For frontend-specific rules see `hoops.ui/CLAUDE.md`. For backend-specific rules see `src/CLAUDE.md`.

## Project Overview

Hoops is a youth basketball league management system with a .NET 9 backend API, Azure Functions, and an Angular 20 frontend. The application manages people, households, teams, divisions, seasons, and game scheduling for a basketball league.

## Technology Stack

- **Backend**: .NET 9.0 (C#) — see `src/CLAUDE.md`
- **Frontend**: Angular 20 with Material Design and Tailwind CSS — see `hoops.ui/CLAUDE.md`
- **Database**: SQL Server with Entity Framework Core 9.0
- **Cloud**: Azure (App Services, Functions, SQL Server)
- **CI/CD**: Azure Pipelines

## Design Principles

All new and refactored code must follow SOLID and DRY. These are not abstract goals — they have concrete implications for this codebase:

### SOLID

**Single Responsibility** — one reason to change per unit.
- Angular: each component owns one view concern; each service owns one domain area. Extract state and business logic to a service when a component exceeds ~150 lines or mixes data-fetching with presentation. The `ScheduleGeneratorStateService` pattern is the reference example.
- .NET: application services (use-case handlers) call one repository area; domain entities contain their own invariants. Controllers only route and return HTTP responses.

**Open/Closed** — extend, don't modify shared infrastructure.
- Add new features as new components/services rather than expanding general-purpose ones with feature-specific flags.
- Shared SCSS files (`forms.scss`, `tables.scss`) define the baseline; override per-component in the component's own `styleUrls`, not by editing the shared file.

**Liskov Substitution** — subtypes must honour the contract of the type they replace.
- .NET: concrete repository implementations must not add observable side-effects beyond what the interface declares.

**Interface Segregation** — inject only what you need.
- Angular: a component that needs one method from a service should not be forced to take the whole service if a narrower interface or a focused child service makes sense.
- .NET: define narrow `IRepository<T>` or use-case-specific interfaces rather than one mega-repository.

**Dependency Inversion** — depend on abstractions; let the container wire concretions.
- Angular: always inject services via Angular DI (`inject()` / constructor injection). Never `new` a service inside a component.
- .NET: always inject via the DI container. Never `new` an infrastructure dependency (repositories, HTTP clients, loggers) inside application logic.

### DRY

- **Logic**: if the same transformation or calculation appears in more than one place, extract it to a shared service method or utility function.
- **Templates**: repeated markup patterns (e.g., a form row, a status badge) belong in a shared component, not copy-pasted across templates.
- **Styles**: shared visual rules go in `src/shared/scss/`; component-only overrides go in the component's stylesheet.
- **Types**: model interfaces live in `src/domain/` (Angular) or the Core/Domain project (.NET). Do not redefine the same shape in multiple places.
- **API access**: all HTTP calls go through a service in `src/services/`. Components never call `HttpClient` directly.

---

## Frontend Testing Direction

- The current Angular frontend still runs unit tests with Jasmine/Karma.
- Future frontend unit tests should be written with Vitest migration in mind: prefer Vitest-compatible patterns and avoid introducing new Jasmine-only helpers unless the existing runner requires them.
- Do not partially migrate individual frontend specs to Vitest syntax unless the task also updates the Angular test configuration and CI accordingly.

## Repository Structure

```
Hoops.sln               ← Solution file
src/                    ← .NET backend (API, Functions, Core, Application, Infrastructure)
tests/                  ← Backend test projects
hoops.ui/               ← Angular frontend
docs/                   ← Architecture and technical documentation
SQL/                    ← Database scripts
scripts/                ← Automation scripts
azure-pipelines.yml     ← CI/CD pipeline definition
```

## Core Domain Model

Key entities and relationships — understand these before making any cross-cutting changes:

- `Person` ↔ `Household` (many-to-one)
- `Season` → `Division` → `Team` → `Player`
- `Division` → `Game` (schedule games and playoff games)
- `Person` → `Player` (one-to-many, across seasons)

## Authentication & Authorization

- **Mechanism**: Cookie-based authentication (20-minute sliding window)
- **Cookie name**: `hoops.auth`
- **Backend**: Configured in `Startup.cs` with `CookieAuthenticationDefaults`
- **Frontend**: Route guards for admin access control in feature modules
- **Authorization**: Policy-based — `[Authorize(Roles = "Admin")]` on controllers
- **NEVER** introduce JWT authentication — the system uses cookies only

## API Conventions

- JSON serialization: Newtonsoft.Json (configured in `Startup.cs`)
- Reference handling: `ReferenceLoopHandling.Ignore` to prevent circular references
- JSON property convention: camelCase
- Swagger available at root (`/`) when running API locally
- CORS configured for `localhost:4200` and production domains

## CI/CD Pipeline

Azure Pipelines configuration in `azure-pipelines.yml`:

**Build & Test Stage:**

1. Restore and build .NET solution (Release config)
2. Run fast backend tests (`--filter TestCategory!=Slow`)
3. Install npm dependencies and build Angular app
4. Run Angular tests in CI mode
5. Publish test results and code coverage

**Deploy Stage:**

- Branch mapping: `develop` → dev environment, `master`/`main` → prod
- Publishes Azure Functions on deploy

**Main branch is `master`.** PRs should target `master`.

## Azure Best Practices

When generating Azure-related code or running Azure terminal commands, always follow Azure best practices. Reference `.github/copilot-instructions.md` for specifics.

## Work Item Management

**Azure DevOps is the single source of truth** for epics, user stories, tasks, and backlog.

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

**Work Item ID Structure:**

- Epics: `{AREA}-###` (e.g., `APM-045`, `AGM-001`)
- Stories: `{AREA}{TYPE}-###` (e.g., `APMF-001` for features, `APMB-001` for bugs)

When working on a story, copy the story content from Azure DevOps and provide it directly. Claude Code will apply the architectural standards defined in this file and the relevant sub-CLAUDE.md files.

## Definition of Done

Every implementation task is **not complete** until all of the following pass:

1. **Frontend builds**: `cd hoops.ui && npm run build` (or `ng build`) exits with no errors.
2. **Backend builds**: `dotnet build Hoops.sln` exits with no errors.
3. **Unit tests written**: Every new Angular component gets a `.spec.ts` file (use the `gen-angular-spec` skill to scaffold it). Every new backend service/function gets an xUnit test class (use the `gen-azure-fn-test` skill).
4. **Tests pass**: `cd hoops.ui && npm run test:ci` and `dotnet test --filter TestCategory!=Slow` exit clean.
5. **E2E / Playwright**: Add Playwright tests for any new user-facing route or multi-step flow when a `playwright/` or `e2e/` test suite is present in the repo.

Claude must run steps 1–2 before reporting a task as complete, and explicitly state test coverage provided for steps 3–4.

## Domain Model Property Reference

Key property names that differ from obvious guesses — check these before writing templates:

| Class | Display property | Key property |
|-------|-----------------|--------------|
| `Season` | `description` | `seasonId` |
| `Division` | `divisionDescription` | `divisionId` |
| `Location` / `GymLocation` | `locationName` | `locationNumber` (not `locationId`) |

## SCSS Path Reference (relative to component file)

| Component depth under `src/` | forms.scss | cards.scss | admin.scss |
|------------------------------|------------|------------|------------|
| `src/admin/<component>/` (2 deep) | `../../shared/scss/forms.scss` | `../../shared/scss/cards.scss` | `../admin.scss` |
| `src/admin/<feature>/<component>/` (3 deep) | `../../../shared/scss/forms.scss` | `../../../shared/scss/cards.scss` | `../../admin.scss` |
| `src/admin/<feature>/<sub>/<component>/` (4 deep) | `../../../../shared/scss/forms.scss` | `../../../../shared/scss/cards.scss` | `../../../admin.scss` |



- `docs/architecture-overview.md` — System design and ER diagrams
- `docs/testing/` — Test specifications and strategy
- `docs/technical-requirements.md` — Functional and non-functional requirements
- `docs/templates/` — Templates for documentation and technical specifications

## Branching Convention

Use git worktrees for any feature that touches more than 2–3 files, so `develop` stays live in the main folder while the feature branch is isolated in a sibling directory:

```bash
git worktree add ../<repo>-<short-feature-name> feature/<name>
```

Work and commit inside the worktree; open PRs from that branch. Remove the worktree when the branch is merged:

```bash
git worktree remove ../hoops-<short-feature-name>
```
