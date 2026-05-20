---
name: gen-signal-form
description: Generate an Angular Signal Forms component (.ts + .html) with all project-specific patterns pre-applied. Use when scaffolding a new admin form component that uses @angular/forms/signals.
argument-hint: <ComponentName> (PascalCase, e.g. AdminUserDetail)
arguments: [name]
allowed-tools: Read Glob Grep Write Edit
shell: powershell
---

# Generate Signal Form Component: $name

Generate a new Angular Signal Forms component for the Hoops project. The component name is **$name** (PascalCase). Derive the kebab-case filename yourself (e.g. `AdminUserDetail` → `admin-user-detail`).

## Reference implementations

Look at these files before generating — match their structure:

!`Get-ChildItem -Path "hoops.ui/src/admin" -Filter "*.ts" -Recurse | Where-Object { $_.Name -notlike "*.spec.ts" } | Select-Object -First 8 -ExpandProperty FullName`

## Output files

Create two files under `hoops.ui/src/admin/{kebab-name}/`:
1. `{kebab-name}.ts` — component class
2. `{kebab-name}.html` — component template

## REQUIRED Signal Forms patterns (non-negotiable)

### Template bindings
- **NEVER use `()` on `[formField]`**: write `[formField]="myForm.fieldName"` NOT `[formField]="myForm.fieldName()"`.
  Reason: `FormField.state = computed(() => this.field()())` — adding `()` passes the FieldNode instead of the proxy and causes "this.field(...) is not a function".
- On `mat-select`, use `[formField]="$any(myForm.fieldName)"` (with `$any()`). The `form(model, schema)` overload has weaker TS inference than `form(model)`.
- For selects whose options are **objects** (not primitives), always add `[compareWith]="compareById"` and define `compareById = (a: T, b: T) => a?.id === b?.id` in the class.
- For reserved model field names that collide with Signal Forms proxy built-ins (`state`, `value`, `errors`, `valid`, `dirty`), use `$any(myForm).fieldName` in the template.

### Effects
- Any effect that reads a data signal to populate the form MUST wrap the `getXxxByName` / lookup calls in `untracked(() => { ... })` to prevent re-triggering on every background reload.
- Race-condition guard: add a flag or check `if (currentValue !== null) return;` at the top of the data-loading effect so user edits are not overwritten by a background refresh.

### Model interfaces
- Type date fields as `Date | string | null` (the API returns ISO strings, not `Date` objects).
- Use `new Date(val)` defensively whenever calling `.toISOString()` or any `Date` method.

### General
- Import Signal Forms from `@angular/forms/signals`.
- Use `form(model)` (no schema arg) when possible — it gives stronger TypeScript inference and avoids needing `$any()` everywhere.
- Use `form(model, schema)` only when validation schema is needed; add `$any()` on affected template bindings.

## Component structure checklist

- `@Component` with `standalone: true`, `imports: [...]`, `changeDetection: ChangeDetectionStrategy.OnPush`
- Inject services via `inject()`
- Expose form as `protected readonly myForm = form(new ModelClass())`
- `ngOnInit` or effect for loading data — wrap lookup side-effects in `untracked()`
- `onSave()` / `onCancel()` methods
- Reasonable HTML with `mat-form-field`, `mat-select`, `mat-input` as appropriate for the model

## Path aliases available
- `@app/*` → `src/*`
- `@domain/*` → `src/domain/*`
- `@shared/*` → `src/shared/*`
