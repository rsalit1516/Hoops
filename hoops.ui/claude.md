# CLAUDE.md — Frontend (hoops.ui)

This file provides Angular-specific guidance for the `hoops.ui/` directory. For cross-cutting project rules see the root `CLAUDE.md`.

## Technology

- Angular 22
- Angular Material (UI components)
- Tailwind CSS (layout and formatting)
- TypeScript (ES modules only)
- Jasmine/Karma currently; Vitest is the target direction for future unit tests

## !! CRITICAL: Modern Angular Patterns !!

This project uses cutting-edge Angular features. Claude's training data may be incomplete for these APIs. **Always follow these rules — do not fall back to older patterns.**

### State Management — Angular Signals

- **ALWAYS** use Angular Signals for all new and refactored state management
- **NEVER** add new NgRx stores, reducers, effects, or selectors
- Existing NgRx code in `reducers/` is legacy — do not extend it; migrate it to signals when touching those areas
- Use `computed()` for all derived state — never recompute in a getter or method that is called from a template
- Do **NOT** use `mutate()` on signals — use `update()` or `set()` instead
- Documentation: https://angular.dev/guide/signals

### Forms — Signal Forms

- **ALWAYS** use Signal Forms for all new and refactored forms
- **NEVER** use `ReactiveFormsModule` or template-driven forms for new work
- If unsure about the Signal Forms API, fetch the documentation before implementing: https://angular.dev/guide/signals/signal-forms
- Save buttons should only be availble for existing records when something has been changed and the form is valid on the form and for a New form when the form is valid.
- **`[formField]` template binding**: bind the field proxy **without** `()` — e.g. `[formField]="myForm.fieldName"`, NOT `[formField]="myForm.fieldName()"`. The `FormField` directive's `state` computed calls the input twice (`this.field()()`), so passing an already-called FieldNode causes "this.field(...) is not a function". Only call the field with `()` in component TypeScript code (e.g. `myForm.fieldName().value.set(...)`), never in template `[formField]` bindings.
- **Reserved field name conflicts**: Signal Forms proxies expose built-in properties (`state`, `value`, `errors`, `valid`, `dirty`, etc.) that shadow model fields with the same name. If a model field shares a name with one of these (e.g. `state` for a US state abbreviation), TypeScript will reject `[formField]="myForm.state"`. Use `$any(myForm).fieldName` to bypass the type conflict — the proxy's `get` trap still routes to the correct model child at runtime.
- **Signal Forms dirty tracking**: calling `field().value.set(x)` alone does NOT mark a field dirty. To test `dirty()` state in a unit test, also call `field().markAsDirty()` after setting the value.
- **Form/detail component styling**: every form or detail component **must** include `cards.scss` and `forms.scss` in its `styleUrls`:
  ```typescript
  styleUrls: [
    '../../../../shared/scss/forms.scss',
    '../../../../shared/scss/cards.scss',
  ],
  ```
  These files define the shared form typography, colours, and card chrome used across all admin detail views. Omitting them results in unstyled or inconsistently styled forms.

### Standalone Components

- **NEVER** set `standalone: true` inside `@Component` or `@Directive` decorators — it is the default in Angular v20+ and is unnecessary noise
- **NEVER** declare new components in NgModules
- Existing module-based components are legacy — do not add to them

### Component Inputs and Outputs

- Use `input()` and `output()` functions instead of `@Input()` and `@Output()` decorators
- Use `computed()` for derived state (not getters that recompute on every access)

### Host Bindings

- **NEVER** use `@HostBinding` or `@HostListener` decorators
- Put host bindings in the `host` object of the `@Component` or `@Directive` decorator instead

### Template Control Flow

- Use native control flow (`@if`, `@for`, `@switch`) for all new and refactored templates
- **NEVER** use `*ngIf`, `*ngFor`, or `*ngSwitch` structural directives
- Keep templates simple — avoid complex logic in templates

### Template Bindings

- Use `[class.foo]="expr"` or `[class]="expr"` bindings instead of `[ngClass]`
- Use `[style.prop]="expr"` or `[style]="expr"` bindings instead of `[ngStyle]`

### Images

- Use `NgOptimizedImage` (`NgOptimizedImage` from `@angular/common`) for all static images
- `NgOptimizedImage` does not apply to inline base64 images

### Services

- Use the `inject()` function instead of constructor injection in all new and refactored services and components
- Use `providedIn: 'root'` for singleton services
- Design each service around a single responsibility

### Accessibility

- All UI **must** pass AXE accessibility checks
- All UI **must** meet WCAG AA minimums: focus management, color contrast ratios, and ARIA attributes where required

### ES Modules

- **ALWAYS** use ES module syntax (`import`/`export`)
- **NEVER** use CommonJS (`require`, `module.exports`)

## Project Structure

Located in `hoops.ui/src/` (Angular modern style — no `app/` subfolder):

- `app.ts` / `app.config.ts` / `app-routing.ts` — Root app files
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

## Admin List Components

Every admin list component **must** include `../../admin.scss` (relative to the component file) in its `styleUrls`. This is what gives the toolbar its correct dark background (`$admin-background-color`) and keeps all admin list toolbars visually consistent.

```typescript
styleUrls: [
  '../../../shared/scss/tables.scss',
  '../../admin.scss',           // ← required for toolbar background + admin chrome
],
```

Omitting `admin.scss` will leave the `<mat-toolbar>` with a white/default Material background, which is wrong on the dark admin theme.

## Testing Requirements

- **Current runner**: Jasmine with Karma
- **Direction**: Prefer Vitest-compatible patterns for all new or substantially rewritten unit tests so the later runner migration is cheaper.
- **Migration guardrail**: Do not partially convert individual specs to Vitest syntax unless the task also updates the project test configuration to run them.
- **Location**: Colocated `.spec.ts` files alongside source files
- **Tooling**: Angular TestBed for components and services
- **Spies/mocks**: Prefer simple test doubles and patterns that are easy to translate to Vitest; avoid adding new Jasmine-specific utilities unless required by the current runner.
- **Focus**: Test observable/signal state changes and DOM updates — not internal implementation details
- **DOM updates**: Always call `fixture.detectChanges()` after actions that affect the DOM
- **Coverage**: All components, services, and pipes must have unit tests for happy and unhappy paths
- All tests must pass before merge
