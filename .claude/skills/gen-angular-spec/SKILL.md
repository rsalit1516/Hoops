---
name: gen-angular-spec
description: Scaffold a Jasmine/Karma spec file for an Angular component with the correct service mock boilerplate for this project. Use when writing a new .spec.ts for any component in hoops.ui.
argument-hint: <ComponentName> (PascalCase, e.g. AdminGameDetail)
arguments: [name]
allowed-tools: Read Glob Grep Write Edit
shell: powershell
---

# Generate Angular Spec: $name

Generate a Jasmine/Karma `.spec.ts` for the **$name** component. Derive the kebab-case filename yourself (e.g. `AdminGameDetail` → `admin-game-detail`).

## Step 1 — read the component first

Before generating the spec, READ the component's `.ts` file to discover:
- Which services are injected (via `inject()`)
- Which signals the component writes to via `.set()` (must be mocked as spy objects, NOT real signals)
- Whether it uses `httpResource`, `fakeAsync`-worthy debounce, or NgRx `Store`

!`Get-ChildItem -Path "hoops.ui/src" -Filter "$name.ts" -Recurse | Select-Object -ExpandProperty FullName`

## Output file

Create `{kebab-name}.spec.ts` alongside the component file.

## REQUIRED mock patterns (apply exactly — these encode past bugs)

### AuthService
Always flush the initialization HTTP call or tests hang:
```typescript
httpMock.expectOne(r => r.url.includes('/api/auth/me')).flush(null);
```

### DivisionService
Constructor has an effect on `seasonService.selectedSeason()`. Mock `selectedSeason` as a real signal to prevent auto-HTTP:
```typescript
{ selectedSeason: signal<Season | undefined>(undefined) }
```

### GameService / httpResource consumers
Background HTTP requests fire automatically. Flush leftovers in `afterEach` BEFORE `httpMock.verify()`:
```typescript
afterEach(() => {
  httpMock.match(() => true).forEach(r => r.flush([]));
  httpMock.verify();
});
```

### DataService.handleError
Returns an RxJS operator — mock as:
```typescript
handleError: jasmine.createSpy().and.callFake((_op: any, result: any) => () => of(result))
```

### Signals that the component calls `.set()` on from inside `subscribe` callbacks
Angular 20 throws `NG0600` (swallowed silently by Zone.js) when `signal.set()` is called from a synchronous `subscribe` next callback.
Mock those specific signals as plain spy objects, NOT `signal()`:
```typescript
// WRONG — causes silent NG0600:
seasonSaved: signal(false),

// CORRECT:
seasonSaved: { set: jasmine.createSpy('seasonSaved.set') },
```
Signals the component only reads (via `computed`) are fine as real `signal()` values.

### fakeAsync + debounce (toObservable + debounceTime)
Angular 21's `ZoneAwareEffectScheduler` stores `Zone.current` at effect creation. If the component is created in `beforeEach` (async zone), `tick()` cannot see its debounce timers.
**Fix**: create the component INSIDE the `fakeAsync` callback:
```typescript
it('debounce test', fakeAsync(() => {
  const localFixture = TestBed.createComponent($nameComponent);
  const localComponent = localFixture.componentInstance;
  localFixture.detectChanges();
  localComponent.mySignal.set('Sm');
  localFixture.detectChanges();
  tick(300);
  expect(spy).toHaveBeenCalledWith('Sm');
}));
```
Do NOT use `jasmine.clock()` — RxJS caches Zone.js's `setInterval` at import time and bypasses jasmine's patch.

### Season instantiation
`Season` has required boolean fields — always use `Object.assign`:
```typescript
Object.assign(new Season(), { seasonId: 5, currentSeason: false })
```
Never use `{ seasonId: 5 } as Season`.

### TeamService.selectedTeam
This is a getter (not a signal). Mock as:
```typescript
{ get selectedTeam(): any { return undefined; } }
```

### NgRx Store
```typescript
jasmine.createSpyObj('Store', ['dispatch', 'pipe', 'select'])
```

### httpMock.expectNone
Has no built-in Jasmine expectation — add an explicit `expect` alongside:
```typescript
const reqs = httpMock.match(r => r.url.includes('/api/foo'));
expect(reqs.length).toBe(0);
```

## Spec file structure

```typescript
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { signal } from '@angular/core';
// ... other imports

describe('$nameComponent', () => {
  let component: $nameComponent;
  let fixture: ComponentFixture<$nameComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [$nameComponent, HttpClientTestingModule],
      providers: [
        // service mocks go here
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    // flush AuthService init call if AuthService is in the tree
    httpMock.expectOne(r => r.url.includes('/api/auth/me')).flush(null);

    fixture = TestBed.createComponent($nameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.match(() => true).forEach(r => r.flush([]));
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```
