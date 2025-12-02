# Feature Flags in Hoops UI

This guide explains how feature flags work in the Angular app and how to use them to show/hide UI, guard routes, and manage rollouts across environments.

## Overview

- Storage: Simple JSON file bundled under `src/assets` per environment.
- Loader: `FeatureFlagService` (`src/app/shared/services/feature-flags.ts`) fetches flags from `environment.featureFlagPath` at app start and caches them in an Angular signal.
- Usage in templates: Structural directive `[appFeatureFlag]` (`src/app/shared/directives/app-feature-flag.directive.ts`).
- Usage in code/guards: Inject `FeatureFlagService` and call `isEnabled('flagName')`.

Defaults: Any unknown/missing flag returns `false` (safe-by-default).

## Environment configuration

Flags JSON path is configured via environment files.

- Local dev: `src/environments/environment.local.ts`
  - `featureFlagPath: '/assets/feature-flags.local.json'`
- Production/staging: set a path in the respective `environment.*.ts` files (e.g., `/assets/feature-flags.prod.json`). Ensure the file is present under `src/assets` and included by `angular.json` assets.

Note: Assets are baked into the build. Changing a JSON file requires rebuilding/redeploying unless you host the flags externally.

## JSON format

File: `src/assets/feature-flags.local.json`

Example:

```
{
  "adminModule": true,
  "notificationModule": true,
  "scheduleModule": true,
  "adminDirectors": true,
  "adminHouseholds": true,
  "adminPeople": true,
  "adminTeams": true,
  "adminColors": true,
  "adminUsers": true,
  "adminNotices": true,
  "newLoginUX": true,
  "experimentalFeatureX": false
}
```

- Keys are case-sensitive.
- Values are boolean.

## Using flags in templates

Use the structural directive to conditionally render content:

```
<button *appFeatureFlag="'adminUsers'" mat-raised-button>Manage Users</button>

<div *appFeatureFlag="'newLoginUX'">
  <!-- new login UI -->
</div>
```

If the flag is disabled or missing, the element isn’t rendered.

## Using flags in TypeScript

Inject the service and check flags in component logic:

```
import { inject } from '@angular/core';
import { FeatureFlagService } from '@app/shared/services/feature-flags';

export class SomeComponent {
  #flags = inject(FeatureFlagService);

  get showBeta() { return this.#flags.isEnabled('experimentalFeatureX'); }
}
```

## Guarding routes with flags

Use a route guard to enable/disable sections by flag. Example guard (already used for Admin):

```
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { FeatureFlagService } from '@app/shared/services/feature-flags';

export const adminGuard: CanActivateFn = () => {
  const flags = inject(FeatureFlagService);
  return flags.isEnabled('adminModule');
};
```

Apply it in routing where appropriate.

## Service API summary

`FeatureFlagService` (`src/app/shared/services/feature-flags.ts`):

- `isEnabled(flag: string): boolean` — returns the current value (defaults to `false`).
- `loadFlags(): void` — re-fetch flags from the configured JSON (call if you need a manual refresh at runtime).
- `flags` — computed signal of the full flag map (`Record<string, boolean>`).

## Testing tips

- Template/Directive: Render a small test component that uses `*appFeatureFlag` and provide a mocked `FeatureFlagService` returning desired values.
- Guards: Run the guard using `TestBed.runInInjectionContext`, provide a mocked `FeatureFlagService` with `isEnabled` returning `true`/`false`, and assert navigation/activation.
- Components: Mock `FeatureFlagService` in the TestBed providers and assert conditional UI is included/excluded.

## Troubleshooting

- 404 on flags JSON: Ensure the file exists under `src/assets` and that `angular.json` includes `"src/assets"` in the assets array.
- Flags not updating: The service fetches on app start. Call `loadFlags()` to refetch during a session, or rebuild/redeploy when changing the bundled file.
- Misspelled key: `isEnabled('unknownKey')` returns `false` silently; verify the JSON key and usage match.

## Rollout guidance

- Start with flags defaulting to `false` in production.
- Enable features progressively in dev/staging files, validate, then flip in production JSON for release.
- For runtime toggles without redeploys, consider hosting a single `flags.json` on a CDN/Storage account and point `featureFlagPath` to that URL (ensure CORS and caching headers are appropriate).

---

For questions or to propose new flags, add them to the relevant `feature-flags.*.json` and reference them via `FeatureFlagService` or `*appFeatureFlag`.
