# Angular Best Practices — Developer Guide

This guide defines the mandatory coding standards for all Angular work in this project. Each rule includes the rationale, what to do, and what to avoid.

---

## TypeScript

### 1. Enable strict type checking

All TypeScript files must compile under strict mode (already configured in `tsconfig.json`). Do not add `// @ts-ignore` or cast to `any` to silence errors — fix the underlying type problem.

**What to do:**
```typescript
// Infer when the type is obvious
const seasonId = 5;                        // number, inferred — no annotation needed
const name: string = getSeasonName(id);    // return type isn't obvious — annotate

// Use unknown when the shape is uncertain, then narrow it
function parseResponse(data: unknown): Season {
  if (!isSeason(data)) throw new Error('Unexpected shape');
  return data;
}
```

**What to avoid:**
```typescript
const data: any = fetchSomething();       // ❌ defeats the type checker
const value = data as Season;             // ❌ unsafe cast — use a type guard instead
```

---

## Components

### 2. Always use standalone components — never declare `standalone: true`

Standalone is the default since Angular v20. Writing `standalone: true` is redundant noise.

**What to do:**
```typescript
@Component({
  selector: 'app-season-detail',
  templateUrl: './season-detail.html',
  imports: [MatFormFieldModule, ReactiveFormsModule],
})
export class SeasonDetailComponent { }
```

**What to avoid:**
```typescript
@Component({
  standalone: true,    // ❌ redundant in Angular v20+
  selector: 'app-season-detail',
  ...
})
```

Never declare components in `NgModule.declarations`. If you see a legacy NgModule-based component, do not add to it — migrate it when you touch that file.

---

### 3. Use `input()` and `output()` functions, not decorators

```typescript
// ✅ Modern signal-based inputs/outputs
import { input, output } from '@angular/core';

export class TeamCardComponent {
  team = input.required<Team>();
  selected = output<Team>();

  onSelect() {
    this.selected.emit(this.team());
  }
}
```

```typescript
// ❌ Old decorator style — do not use for new code
@Input() team!: Team;
@Output() selected = new EventEmitter<Team>();
```

---

### 4. Put host bindings in the `host` object, not on decorators

```typescript
// ✅
@Component({
  selector: 'app-badge',
  host: {
    '[class.active]': 'isActive()',
    '(click)': 'handleClick()',
    'role': 'button',
  },
  ...
})
export class BadgeComponent {
  isActive = input(false);
  handleClick() { ... }
}
```

```typescript
// ❌ Never use @HostBinding or @HostListener
@HostBinding('class.active') get active() { return this.isActive(); }
@HostListener('click') handleClick() { ... }
```

---

### 5. Use `class` and `style` bindings instead of `ngClass` / `ngStyle`

```html
<!-- ✅ -->
<div [class.selected]="isSelected()">...</div>
<div [class]="{ selected: isSelected(), disabled: !isEnabled() }">...</div>
<div [style.color]="textColor()">...</div>

<!-- ❌ -->
<div [ngClass]="{ selected: isSelected() }">...</div>
<div [ngStyle]="{ color: textColor() }">...</div>
```

---

### 6. Keep components small — one view concern per component

A component that exceeds ~150 lines or mixes data-fetching with presentation should be split. Extract state and business logic to a service.

---

## Templates

### 7. Use native control flow, not structural directives

Angular's built-in `@if`, `@for`, and `@switch` are the only supported control flow for new templates.

```html
<!-- ✅ -->
@if (seasons().length > 0) {
  <mat-list>
    @for (season of seasons(); track season.seasonId) {
      <mat-list-item>{{ season.description }}</mat-list-item>
    }
  </mat-list>
} @else {
  <p>No seasons found.</p>
}
```

```html
<!-- ❌ -->
<mat-list *ngIf="seasons().length > 0">
  <mat-list-item *ngFor="let season of seasons()">
    {{ season.description }}
  </mat-list-item>
</mat-list>
```

Do not assume browser globals like `new Date()` are available in templates. Use a `computed()` signal or a pipe instead.

---

### 8. Use the `async` pipe for observables in templates

```html
<!-- ✅ -->
<div>{{ data$ | async }}</div>

<!-- For signals, no pipe is needed — call the signal directly -->
<div>{{ mySignal() }}</div>
```

---

## State Management

### 9. Use signals for all local component state

```typescript
// ✅
export class GameListComponent {
  private gameService = inject(GameService);

  readonly filter = signal('');
  readonly games = this.gameService.games;
  readonly filtered = computed(() =>
    this.games().filter(g => g.homeTeamName.includes(this.filter()))
  );
}
```

```typescript
// ❌ — do not use NgRx for new work
store.dispatch(loadGames());
```

### 10. Use `computed()` for derived state, `update()` or `set()` to change it

```typescript
// ✅
readonly isValid = computed(() => this.form.valid());

// ✅ Mutate via set() or update()
this.count.set(0);
this.count.update(n => n + 1);

// ❌ Never use mutate() — removed in Angular 17+
this.items.mutate(arr => arr.push(newItem));
```

---

## Services

### 11. Use `inject()` instead of constructor injection

```typescript
// ✅
@Injectable({ providedIn: 'root' })
export class SeasonService {
  private http = inject(HttpClient);
  private logger = inject(LoggerService);
}
```

```typescript
// ❌ Old constructor injection
@Injectable({ providedIn: 'root' })
export class SeasonService {
  constructor(private http: HttpClient, private logger: LoggerService) {}
}
```

All singleton services use `providedIn: 'root'`. Never scope a service to a module unless there is a specific reason.

---

## Images

### 12. Use `NgOptimizedImage` for all static images

```typescript
// In your component imports:
import { NgOptimizedImage } from '@angular/common';

@Component({
  imports: [NgOptimizedImage],
  template: `<img ngSrc="/assets/logo.png" width="120" height="40" priority alt="Hoops logo">`,
})
```

`NgOptimizedImage` is **not** compatible with inline base64 data URIs — use standard `<img>` for those.

---

## Accessibility

### 13. All UI must meet WCAG AA and pass AXE

Every new component must:

- Pass `axe-core` checks — run via browser DevTools or `npm run test:accessibility` if configured
- Meet WCAG AA color contrast (4.5:1 for normal text, 3:1 for large text)
- Provide `aria-label` or `aria-labelledby` on all interactive elements that lack visible text
- Manage focus correctly on modals, dialogs, and route transitions
- Support keyboard navigation for all interactive elements

```html
<!-- ✅ Button with accessible label -->
<button mat-icon-button [attr.aria-label]="'Delete ' + player.name">
  <mat-icon>delete</mat-icon>
</button>

<!-- ❌ Icon-only button with no label -->
<button mat-icon-button>
  <mat-icon>delete</mat-icon>
</button>
```

---

## Lazy Loading

### 14. Implement lazy loading for all feature routes

```typescript
// app-routing.ts ✅
{
  path: 'admin',
  canActivate: [authGuard],
  loadChildren: () => import('./admin/admin-routing').then(m => m.ADMIN_ROUTES),
},
```

Never `import` a feature component directly in the root routes file — this defeats tree-shaking and increases the initial bundle.

---

## Quick Reference Checklist

Before opening a PR, verify every new or modified component:

- [ ] No `standalone: true` in decorator
- [ ] Uses `input()` / `output()` — not `@Input()` / `@Output()`
- [ ] No `@HostBinding` or `@HostListener`
- [ ] No `ngClass` or `ngStyle` in templates
- [ ] Control flow uses `@if` / `@for` / `@switch` — not `*ngIf` / `*ngFor`
- [ ] State managed with signals; derived state uses `computed()`
- [ ] No `mutate()` on signals
- [ ] Services injected via `inject()`, not constructor
- [ ] Images use `NgOptimizedImage` (where applicable)
- [ ] Interactive elements have accessible labels
- [ ] No `any` types introduced
