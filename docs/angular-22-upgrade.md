# Angular 22 Upgrade

**Completed:** 2026-06-05  
**Branch:** `version/angular-22` → merged to `develop`

---

## Summary

Two separate concerns were combined to unblock the upgrade:

1. **NgRx removal** (`debt/remove-ngrx`) — 74 files importing `@ngrx/*` were blocking Angular 22 compatibility since NgRx 22 does not exist.
2. **Angular 22 upgrade** (`version/angular-22`) — ran `ng update`, applied manual fixes, and resolved stash merge conflicts.

---

## NgRx Removal

All NgRx state management was replaced with Angular signal services already present in the codebase.

**Deleted (dead state files):**
- `src/state/`, `src/reducers/`
- `src/user/state/`, `src/home/state/`, `src/games/state/`
- `src/admin/state/`, `src/admin/director/state/`
- `src/user/auth.service-deprecated.ts`

**Cleaned (NgModules):**
- Removed `StoreModule.forFeature` and `EffectsModule.forFeature` from `user.module.ts`, `home.module.ts`, `games.module.ts`, `admin.module.ts`, `director.module.ts`
- Removed `StoreModule.forRoot`, `EffectsModule.forRoot`, `StoreDevtoolsModule` from `app.config.ts`

**Replaced (active Store usage):**

| Old (NgRx) | New (Signals) |
|---|---|
| `store.dispatch(new SetCurrentUser(user))` | `authService.currentUser.set(user)` |
| `store.dispatch(new SetCurrentDivision(div))` | `divisionService.updateSelectedDivision(div)` |
| `store.dispatch(new SetCurrentTeam(team))` | `teamService.updateSelectedTeam(team)` |
| `store.dispatch(new SetSelectedContent(c))` | `contentService.selectedContent.set(c)` |
| `store.dispatch(new LoadAdminContent())` | `contentService.fetchAllContents()` |
| `store.dispatch(new SetSelectedTeam(team))` | `teamService.updateSelectedTeam(team)` |
| `store.select(fromGames.getFilteredGames)` | `gameService.divisionGames` signal |
| `store.select(fromUser.getCurrentUser)` | `authService.currentUser` signal |

**Spec files cleaned:** `login.spec.ts`, `division.service.spec.ts`, `auth.service.spec.ts`, `content-edit.spec.ts`, `admin-season-detail.spec.ts`, `playoffs-shell.spec.ts`

**Result:** 77 files changed, 2811 deletions, zero `@ngrx` imports remaining.

---

## Angular 22 Upgrade

### Package changes (`package.json`)

| Package | Before | After |
|---|---|---|
| `@angular/core` | `^21.x` | `^22.0.0` |
| `@angular/cli` | `^21.x` | `^22.0.0` |
| `@angular/material` | `^21.x` | `^22.0.0` |
| `typescript` | `~5.x` | `~6.0.3` |

### Auto-migrations applied by `ng update`

- `ChangeDetectionStrategy.OnPush` added to all components
- `withXhr()` added to `provideHttpClient()` in `app.config.ts`

### Manual fixes

- `paramsInheritanceStrategy: 'emptyOnly'` added to router config to preserve existing route param inheritance behavior (Angular 22 defaults to `'always'`)
- Fixed 39 files with double-comma syntax errors (`,, ChangeDetectionStrategy`) introduced by the `ng update` migration script

---

## Breaking Changes — What to Watch During Testing

- **`ChangeDetectionStrategy.OnPush` everywhere** — components that mutate state imperatively (not via signals) may not re-render. Watch for "stale" UI after saves/deletes.
- **`paramsInheritanceStrategy: 'emptyOnly'`** — manually set to match prior behavior; verify nested route params still resolve correctly.
- **TypeScript 6** — stricter type checking; compiler errors were resolved but runtime behavior should be tested.
- **Signal Forms `markAsTouched()` change** — now marks descendants; may affect form validation display in registration flows.

---

## Testing Checklist Before Merging to `master`

- [ ] Login / logout flow
- [ ] Division / team selection in games shell
- [ ] Game schedule display and score entry
- [ ] Admin game management (create, edit, delete)
- [ ] Web content create / clone / delete
- [ ] Season setup wizard
- [ ] Player registration
- [ ] Admin dashboard team selection
- [ ] Sidebar admin menu visibility
- [ ] `npm run test:ci` — all unit tests pass
