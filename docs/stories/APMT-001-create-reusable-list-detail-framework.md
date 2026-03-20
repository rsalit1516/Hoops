# Story APMT-001: Create Reusable List-Detail Framework for Admin Modules

**Story ID:** APMT-001
**Feature:** Admin Infrastructure
**Epic:** [APM-001 - Admin People Management](../epics/APM-001-admin-people-management.md)
**Type:** Technical/Infrastructure
**Story Points:** 8
**Priority:** High

## Technical Story

As a developer, I want to create a reusable list-detail framework using Angular content projection (ng-content/ng-template) so that all admin modules (People, Households, Directors) share a consistent structure and reduce code duplication.

## Business Value

- **Faster Feature Development**: New admin modules can be created in hours instead of days
- **Consistency**: All list-detail pages follow the same UX patterns
- **Maintainability**: Fixes and enhancements apply to all modules automatically
- **Code Quality**: Reduces duplication and potential bugs from copy-paste code

## Acceptance Criteria

### Core Framework Component

- [ ] Create `AdminListDetailShell` base component with:
  - [ ] Configurable header with title and "Add" button
  - [ ] Filter section using ng-content projection
  - [ ] Material table with sorting and pagination
  - [ ] Detail form/dialog using ng-content projection
  - [ ] Loading states and error handling
  - [ ] Empty state messaging

### Table Configuration

- [ ] Support configurable columns via input property
- [ ] Built-in sorting with customizable sort accessors
- [ ] Built-in pagination with configurable page sizes
- [ ] Row click handling for opening detail forms
- [ ] Consistent styling from `tables.scss`

### Content Projection Slots

- [ ] `<ng-content select="[filter]">` - Custom filter UI
- [ ] `<ng-content select="[detail-form]">` - Detail form component
- [ ] `<ng-content select="[empty-state]">` - Custom empty state message
- [ ] `<ng-content select="[actions]">` - Custom row actions

### Form Integration

- [ ] Support both modal (dialog) and inline detail forms
- [ ] Handle form open/close state management
- [ ] Integrate with PendingChangesGuard for unsaved changes
- [ ] Emit events for CRUD operations (add, edit, delete, save, cancel)

### Refactoring Existing Modules

- [ ] Refactor People list-detail to use framework
- [ ] Refactor Households list-detail to use framework
- [ ] Implement Directors list-detail using framework
- [ ] Verify all functionality preserved after refactoring

## Definition of Done

- [ ] Framework components created and unit tested (>80% coverage)
- [ ] Three modules successfully using the framework
- [ ] Documentation with usage examples
- [ ] Code reviewed and approved
- [ ] All existing tests still passing
- [ ] Accessibility requirements met (WCAG 2.1 AA)

## Technical Design

### Component Architecture

```typescript
// Base shell component
@Component({
  selector: "admin-list-detail-shell",
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="admin-list-detail-container">
      <!-- Header with title and add button -->
      <div class="header">
        <h1>{{ title }}</h1>
        <button
          mat-raised-button
          color="primary"
          (click)="onAdd()"
          *ngIf="showAddButton"
        >
          <mat-icon>add</mat-icon> {{ addButtonText }}
        </button>
      </div>

      <!-- Filter section (projected) -->
      <div class="filter-section" *ngIf="hasFilterContent">
        <ng-content select="[filter]"></ng-content>
      </div>

      <!-- Error/Loading states -->
      <div class="error-message" *ngIf="errorMessage()" role="alert">
        {{ errorMessage() }}
      </div>

      <div class="loading" *ngIf="isLoading()">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <!-- Data table -->
      <div class="table-container" *ngIf="!isLoading() && !errorMessage()">
        <table
          mat-table
          [dataSource]="dataSource"
          matSort
          class="mat-elevation-z2"
        >
          <!-- Dynamic columns from config -->
          <ng-container
            *ngFor="let column of columns"
            [matColumnDef]="column.key"
          >
            <th
              mat-header-cell
              *matHeaderCellDef
              [mat-sort-header]="column.sortable ? column.key : null"
            >
              {{ column.label }}
            </th>
            <td mat-cell *matCellDef="let row">
              <ng-container *ngIf="column.template; else defaultCell">
                <ng-container
                  *ngTemplateOutlet="
                    column.template;
                    context: { $implicit: row }
                  "
                >
                </ng-container>
              </ng-container>
              <ng-template #defaultCell>
                {{
                  column.valueGetter ? column.valueGetter(row) : row[column.key]
                }}
              </ng-template>
            </td>
          </ng-container>

          <!-- Actions column (optional) -->
          <ng-container matColumnDef="actions" *ngIf="showActionsColumn">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let row">
              <ng-content
                select="[actions]"
                [ngTemplateOutletContext]="{ $implicit: row }"
              >
              </ng-content>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr
            mat-row
            *matRowDef="let row; columns: displayedColumns"
            (click)="onRowClick(row)"
            [class.clickable-row]="rowClickable"
          ></tr>

          <!-- Empty state -->
          <tr class="mat-row no-data-row" *matNoDataRow>
            <td class="mat-cell" [attr.colspan]="displayedColumns.length">
              <ng-content select="[empty-state]">
                <div class="default-empty-state">
                  <p>No records found.</p>
                </div>
              </ng-content>
            </td>
          </tr>
        </table>

        <!-- Pagination -->
        <mat-paginator
          [pageSizeOptions]="pageSizeOptions"
          [pageSize]="defaultPageSize"
          [showFirstLastButtons]="true"
          [aria-label]="paginatorAriaLabel"
        >
        </mat-paginator>
      </div>
    </div>

    <!-- Detail form/dialog (projected) -->
    <ng-content select="[detail-form]"></ng-content>
  `,
  styleUrls: ["./admin-list-detail-shell.scss"],
})
export class AdminListDetailShell<T> implements AfterViewInit {
  // Configuration inputs
  @Input() title!: string;
  @Input() columns!: ColumnConfig<T>[];
  @Input() dataSource!: MatTableDataSource<T>;
  @Input() showAddButton = true;
  @Input() addButtonText = "Add New";
  @Input() rowClickable = true;
  @Input() showActionsColumn = false;
  @Input() pageSizeOptions = [10, 25, 50, 100];
  @Input() defaultPageSize = 25;
  @Input() paginatorAriaLabel = "Select page";

  // State signals
  @Input() isLoading = signal(false);
  @Input() errorMessage = signal<string | null>(null);

  // Events
  @Output() rowClick = new EventEmitter<T>();
  @Output() addClick = new EventEmitter<void>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ContentChild("filter") filterContent?: TemplateRef<any>;

  get hasFilterContent(): boolean {
    return !!this.filterContent;
  }

  get displayedColumns(): string[] {
    const cols = this.columns.map((c) => c.key);
    if (this.showActionsColumn) {
      cols.push("actions");
    }
    return cols;
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  onRowClick(row: T): void {
    if (this.rowClickable) {
      this.rowClick.emit(row);
    }
  }

  onAdd(): void {
    this.addClick.emit();
  }
}

// Column configuration interface
export interface ColumnConfig<T> {
  key: string;
  label: string;
  sortable?: boolean;
  valueGetter?: (row: T) => string | number;
  template?: TemplateRef<any>;
}
```

### Usage Example: Directors Module

```typescript
// director-list-container.ts
@Component({
  selector: "admin-director-list-container",
  standalone: true,
  imports: [AdminListDetailShell, DirectorFormDialog],
  template: `
    <admin-list-detail-shell
      title="Directors"
      [columns]="columns"
      [dataSource]="dataSource"
      [isLoading]="isLoading"
      [errorMessage]="errorMessage"
      (rowClick)="editDirector($event)"
      (addClick)="addDirector()"
    >
      <!-- Custom filter section (optional) -->
      <div filter class="director-filter">
        <mat-form-field>
          <mat-label>Search</mat-label>
          <input
            matInput
            placeholder="Search directors..."
            (input)="applyFilter($event)"
          />
        </mat-form-field>
      </div>

      <!-- Detail form as dialog -->
      <director-form-dialog
        detail-form
        [director]="selectedDirector()"
        [isOpen]="isFormOpen()"
        (save)="onSave($event)"
        (cancel)="onCancel()"
      >
      </director-form-dialog>

      <!-- Custom empty state -->
      <div empty-state>
        <mat-icon>people_outline</mat-icon>
        <p>No directors found. Click "Add Director" to get started.</p>
      </div>
    </admin-list-detail-shell>
  `,
})
export class DirectorListContainer {
  directorService = inject(DirectorService);

  dataSource = new MatTableDataSource<Director>();
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  selectedDirector = signal<Director | null>(null);
  isFormOpen = signal(false);

  columns: ColumnConfig<Director>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      valueGetter: (row) => `${row.firstName} ${row.lastName}`,
    },
    {
      key: "title",
      label: "Title",
      sortable: true,
    },
  ];

  ngOnInit() {
    this.loadDirectors();
  }

  loadDirectors() {
    this.isLoading.set(true);
    this.directorService.fetchDirectors();

    effect(() => {
      this.dataSource.data = this.directorService.directorsSignal();
      this.isLoading.set(false);
    });
  }

  editDirector(director: Director) {
    this.selectedDirector.set(director);
    this.isFormOpen.set(true);
  }

  addDirector() {
    this.selectedDirector.set(null);
    this.isFormOpen.set(true);
  }

  onSave(director: Director) {
    // Save logic
    this.isFormOpen.set(false);
    this.loadDirectors();
  }

  onCancel() {
    this.isFormOpen.set(false);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
```

## Refactoring Strategy

### Phase 1: Create Framework (2-3 days)

1. Create `admin-list-detail-shell` component in `src/app/admin/shared/`
2. Create `ColumnConfig` interface and types
3. Add unit tests for framework component (>80% coverage)
4. Document usage patterns with examples

### Phase 2: Refactor Existing (1-2 days)

1. Refactor People module to use framework
2. Refactor Households module to use framework
3. Update existing unit tests
4. Verify functionality preserved with manual testing

### Phase 3: Implement Directors (1 day)

1. Implement Directors list using framework
2. Add any framework enhancements discovered during implementation
3. Final integration testing across all three modules

## Dependencies

- **Enables:** APMF-047 (Add Director), APMF-048 (Edit Director), APMF-049 (Delete Director)
- **Refactors:** Existing People and Households modules
- **Related:** All future admin list-detail modules (Teams, Games, Seasons)

## Technical Notes

### Content Projection vs. Template Refs

**Use `ng-content` for:**

- Static UI elements (filters, headers, custom empty states)
- Components that don't need dynamic data binding

**Use `ng-template` with `ngTemplateOutlet` for:**

- Dynamic column rendering
- Row actions that need access to row data
- Conditional content based on data state

### State Management

- Use signals for reactive state (loading, errors, selected item)
- Emit events for CRUD operations to parent components
- Keep framework stateless - let parent manage business logic

### Styling

- Use `tables.scss` for consistent table styling
- Allow custom SCSS overrides via CSS classes
- Maintain accessibility (ARIA labels, keyboard navigation)

### Performance Considerations

- Use `OnPush` change detection strategy
- Implement trackBy functions for ngFor loops
- Virtual scrolling for large datasets (future enhancement)
- Lazy load detail forms to reduce initial bundle size

## Testing Strategy

### Unit Tests (Framework Component)

- Component initialization with various configurations
- Content projection slots render correctly
- Table sorting and pagination functionality
- Event emissions (rowClick, addClick)
- Loading and error state handling
- Empty state display

### Integration Tests (Per Module)

- People module with framework
- Households module with framework
- Directors module with framework
- Verify all existing functionality preserved

### Accessibility Tests

- Keyboard navigation (Tab, Enter, Arrow keys)
- Screen reader compatibility
- ARIA labels and roles
- Focus management

## Files to Create

```
src/app/admin/shared/
├── admin-list-detail-shell/
│   ├── admin-list-detail-shell.ts
│   ├── admin-list-detail-shell.html (inline in component)
│   ├── admin-list-detail-shell.scss
│   ├── admin-list-detail-shell.spec.ts
│   └── index.ts
├── models/
│   └── column-config.ts
└── README.md (Usage documentation)
```

## Files to Modify

```
src/app/admin/
├── people/
│   └── people-list-container.ts (refactor to use framework)
├── households/
│   └── households-list-container.ts (refactor to use framework)
└── director/
    └── director-list-container.ts (new implementation using framework)
```

## Related Stories

- **Enables:** APMF-047, APMF-048, APMF-049
- **Future:** Apply pattern to Teams, Games, Seasons modules
- **Depends On:** None (foundational work)

## References

- [Angular Content Projection Guide](https://angular.dev/guide/components/content-projection)
- [Material Table Documentation](https://material.angular.io/components/table/overview)
- [Angular Signals Guide](https://angular.dev/guide/signals)
- Project SCSS: `src/app/shared/scss/tables.scss`

---

**Created:** 2025-10-27
**Last Updated:** 2025-10-27
**Status:** Ready for Development
**Assigned To:** TBD
