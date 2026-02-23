# CLAUDE.md — Frontend (hoops.ui)

This file provides Angular-specific guidance for the `hoops.ui/` directory. For cross-cutting project rules see the root `CLAUDE.md`.

## Technology

- Angular 20
- Angular Material (UI components)
- Tailwind CSS (layout and formatting)
- TypeScript (ES modules only)
- Jasmine/Karma (testing)

## !! CRITICAL: Modern Angular Patterns !!

This project uses cutting-edge Angular features. Claude's training data may be incomplete for these APIs. **Always follow these rules — do not fall back to older patterns.**

### State Management — Angular Signals

- **ALWAYS** use Angular Signals for all new and refactored state management
- **NEVER** add new NgRx stores, reducers, effects, or selectors
- Existing NgRx code in `reducers/` is legacy — do not extend it; migrate it to signals when touching those areas
- Documentation: https://angular.dev/guide/signals

### Forms — Signal Forms

- **ALWAYS** use Signal Forms for all new and refactored forms
- **NEVER** use `ReactiveFormsModule` or template-driven forms for new work
- If unsure about the Signal Forms API, fetch the documentation before implementing: https://angular.dev/guide/signals/signal-forms

### Standalone Components

- **ALWAYS** create new components as standalone (`standalone: true`)
- **NEVER** declare new components in NgModules
- Existing module-based components are legacy — do not add to them

### ES Modules

- **ALWAYS** use ES module syntax (`import`/`export`)
- **NEVER** use CommonJS (`require`, `module.exports`)

## Project Structure

Located in `hoops.ui/src/app/`:

- `admin/` — Admin features: people (`admin/people/`), games (`admin/games/`)
- `games/` — Game viewing and management
- `home/` — Home/landing feature
- `user/` — User profile and settings
- `contacts/` — Contact management
- `photos/` — Photo management
- `club-docs/` — Club documentation
- `shared/` — Reusable components and pipes
- `services/` — Angular data services (HTTP calls to backend API)
- `reducers/` — Legacy NgRx state (do not extend)

## Styling

- Use **Angular Material** components for all UI elements
- Use **Tailwind CSS** for layout and custom formatting
- Global styles: `hoops.ui/src/Content/styles.scss`
- Style preprocessor includes `src/Content` path
- Do not introduce additional CSS frameworks

## Authentication

- Cookie-based auth handled by backend (`hoops.auth` cookie)
- Frontend uses route guards for admin access control
- Guards are located in feature module routing files
- Do not implement any client-side token storage or JWT handling

## Environment Configuration

Environment files in `hoops.ui/src/environments/`:

| File                         | Purpose             |
| ---------------------------- | ------------------- |
| `environment.ts`             | Base                |
| `environment.local.ts`       | Local dev (default) |
| `environment.development.ts` | Dev/staging         |
| `environment.staging.ts`     | Staging             |
| `environment.prod.ts`        | Production          |
| `environment.test.ts`        | Testing             |

Build configurations: `local` (default), `development`, `staging`, `production`

## Development Commands

```bash
cd hoops.ui

# Install dependencies
npm ci

# Start local dev server (localhost:4200)
npm start

# Build for production
npm run build:prod

# Build for staging
npm run build:staging

# Run tests (interactive)
npm test

# Run tests in CI mode (headless)
npm run test:ci

# Lint TypeScript files
npm run lint
```

## Testing Requirements

- **Framework**: Jasmine with Karma
- **Location**: Colocated `.spec.ts` files alongside source files
- **Tooling**: Angular TestBed for components and services
- **Focus**: Test observable/signal state changes and DOM updates — not internal implementation details
- **DOM updates**: Always call `fixture.detectChanges()` after actions that affect the DOM
- **Coverage**: All components, services, and pipes must have unit tests
- All tests must pass before merge
