# Playwright E2E Test Roadmap

Tracks the status and planned scope of all Playwright end-to-end tests for the Hoops application.

## Setup

**Location:** `hoops.ui/playwright/`
**Config:** `hoops.ui/playwright.config.ts`
**Runner:** `npm run e2e` (headless) · `npm run e2e:headed` · `npm run e2e:report`

**Required env vars** (see `.env.e2e.example`):
```
E2E_USERNAME=<admin credentials>
E2E_PASSWORD=<admin credentials>
E2E_BASE_URL=http://localhost:4200   # optional override
```

### Project structure

| Playwright project | Auth state | Test files |
|---|---|---|
| `setup` | — | `playwright/auth.setup.ts` — logs in once, saves cookie state |
| `chromium` | None (unauthenticated) | `playwright/tests/*.spec.ts` |
| `chromium:admin` | Pre-authenticated admin | `playwright/tests/admin/**/*.spec.ts` |

---

## Implemented tests (branch: `feat/playwright-e2e`)

### Auth (`playwright/tests/auth.spec.ts`)

| ID | Description | Type |
|---|---|---|
| AUTH-01 | Valid credentials → redirected to home; logout → admin route blocked | Positive + Negative |
| AUTH-02 | Accessing `/admin/dashboard` while logged out → redirected to `/login?returnUrl=…` | Negative |
| AUTH-03 | Wrong credentials → "User Name or password is not valid" error shown | Negative |
| AUTH-04 | Submitting empty login form → error shown immediately (no API call) | Negative |
| AUTH-05 | After admin login → "Admin" link visible in the top navigation bar | Positive |

### Public pages (`playwright/tests/public.spec.ts`)

| ID | Description | Type |
|---|---|---|
| PUB-01 | `/games/schedule` loads without redirecting to login | Positive |
| PUB-02 | `/games/standings` loads and renders the standings table | Positive |
| PUB-03 | `/games/playoffs` loads without redirecting to login | Positive |

### Admin navigation (`playwright/tests/admin/admin-nav.spec.ts`)

| ID | Description | Type |
|---|---|---|
| ADMIN-NAV-01 | `/admin/dashboard` loads without a login redirect | Positive |
| ADMIN-NAV-02 | Admin sidenav is visible and contains the Dashboard link | Positive |
| ADMIN-NAV-03 | Households link is visible in the admin sidenav | Positive |
| ADMIN-NAV-04 | Clicking Households navigates to `/admin/households` | Positive |

### Households (`playwright/tests/admin/household.spec.ts`)

| ID | Description | Type |
|---|---|---|
| HH-01 | Create a new household → Save & Close → search by name → row appears in the list | Positive |

---

## Proposed tests — next batches

Group these into feature-scoped branches off `develop` once `feat/playwright-e2e` is merged.

### Batch 1 — Household management (suggested branch: `feat/e2e-households`)

| ID | Description | Notes |
|---|---|---|
| HH-02 | Edit an existing household — change a field, Save, navigate away and back, verify change persisted | Use a known fixture household or the one created by HH-01 |
| HH-03 | Alphabetical filter — click 'B', verify all visible rows start with 'B'; click 'All' (if present), verify broader results | Tests `csbc-alphabetical-search` component |
| HH-04 | Search by email — enter a known email, verify matching row appears | Exercises the email filter path in `onFilterChange` |
| HH-05 | Cancel on new household — fill partial form, click Cancel, verify no record created and list unchanged | Negative |

### Batch 2 — People management (suggested branch: `feat/e2e-people`)

| ID | Description | Notes |
|---|---|---|
| PPL-01 | Create a new person — fill required fields, save, verify in the people list | Mirrors HH-01 for the people module |
| PPL-02 | Assign a person to a household — open person detail, set household, save, verify in household members panel | Tests cross-module data linkage |
| PPL-03 | People alphabetical filter — same pattern as HH-03 for the people list | |
| PPL-04 | Edit person information — change name/address, save, verify update persisted | |

### Batch 3 — Admin game schedule (suggested branch: `feat/e2e-games`)

| ID | Description | Notes |
|---|---|---|
| GAME-01 | Navigate to admin games — schedule table renders for the current season/division | Requires a season with games seeded |
| GAME-02 | Edit a game — change location/time, save, verify change shown in schedule | |
| GAME-03 | Enter game score — open a completed game, enter scores, save, verify in standings | Tests the score-entry flow |

### Batch 4 — Season setup (suggested branch: `feat/e2e-season-setup`)

| ID | Description | Notes |
|---|---|---|
| SS-01 | Walk through season setup form — fill the 10-division template, verify dates auto-shift when start date changes | Tests `ScheduleGeneratorStateService` date propagation |
| SS-02 | Save season setup — complete form, save, verify season appears in the season list | |

### Batch 5 — Authorization & security (suggested branch: `feat/e2e-auth-extended`)

| ID | Description | Notes |
|---|---|---|
| AUTH-06 | Non-admin user login — verify Admin nav link is **absent** and `/admin` redirects away | Requires a second set of non-admin credentials in env |
| AUTH-07 | Session timeout — verify idle session redirects to `/login` | Can be accelerated using the dev session timer visible in non-production builds |
| AUTH-08 | Direct URL access after logout — navigate to `/admin/households` after logout, verify redirect to login with `returnUrl` | Extends AUTH-02 for a deeper route |

---

## Branching strategy

Each batch above is a separate feature branch off `develop`. Do **not** reuse the initial `feat/playwright-e2e` branch after it is merged — branch per feature area instead.

```
develop
  └── feat/e2e-households      (Batch 1)
  └── feat/e2e-people          (Batch 2)
  └── feat/e2e-games           (Batch 3)
  └── feat/e2e-season-setup    (Batch 4)
  └── feat/e2e-auth-extended   (Batch 5)
```

All branches inherit the Playwright infrastructure (config, `auth.setup.ts`) from `develop` once `feat/playwright-e2e` is merged.
