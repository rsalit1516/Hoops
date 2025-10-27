# AdminListDetailShell Component

A reusable Angular component that provides a consistent structure for admin list-detail pages with Material Design.

## Features

- **Configurable table** with sorting, pagination, and dynamic columns
- **Content projection** for filters, detail forms, empty states, and actions
- **Signal-based state management** for reactive loading and error states
- **Responsive design** with mobile and print styles
- **Type-safe** generic component supporting any data type
- **Accessible** with proper ARIA labels and semantic HTML
- **OnPush change detection** for optimal performance

## Installation

Import the component in your feature module or component:

```typescript
import { AdminListDetailShell } from '@admin/shared/admin-list-detail-shell';
import { ColumnConfig } from '@admin/shared/models';
```

## Basic Usage

### 1. Define Your Data Model

```typescript
interface Director {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
}
```

### 2. Configure Columns

```typescript
import { ColumnConfig } from '@admin/shared/models';

export class DirectorListComponent {
  columns: ColumnConfig<Director>[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      width: '80px',
    },
    {
      key: 'lastName',
      label: 'Last Name',
      sortable: true,
    },
    {
      key: 'firstName',
      label: 'First Name',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'phone',
      label: 'Phone',
      sortable: false,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
    },
  ];
}
```

### 3. Set Up Data Source and State

```typescript
import { signal } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export class DirectorListComponent {
  // Data source for the table
  dataSource = new MatTableDataSource<Director>([]);

  // State signals
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(private directorService: DirectorService) {
    this.loadDirectors();
  }

  private loadDirectors(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.directorService.getDirectors().subscribe({
      next: (directors) => {
        this.dataSource.data = directors;
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Failed to load directors. Please try again.');
        this.isLoading.set(false);
      },
    });
  }
}
```

### 4. Use the Component in Your Template

```html
<admin-list-detail-shell
  title="Directors"
  [columns]="columns"
  [dataSource]="dataSource"
  [isLoading]="isLoading"
  [errorMessage]="errorMessage"
  (rowClick)="editDirector($event)"
  (addClick)="addDirector()"
>
</admin-list-detail-shell>
```

### 5. Handle Events

```typescript
export class DirectorListComponent {
  editDirector(director: Director): void {
    // Open edit dialog or navigate to edit page
    console.log('Editing director:', director);
  }

  addDirector(): void {
    // Open add dialog or navigate to add page
    console.log('Adding new director');
  }
}
```

## Advanced Usage

### Custom Column Rendering with valueGetter

Use `valueGetter` to transform or combine data before display:

```typescript
columns: ColumnConfig<Director>[] = [
  {
    key: 'fullName',
    label: 'Full Name',
    sortable: true,
    valueGetter: (director: Director) =>
      `${director.firstName} ${director.lastName}`,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    valueGetter: (director: Director) =>
      director.status === 'active' ? 'Active' : 'Inactive',
    cellClass: 'status-cell',
  },
];
```

### Custom Column Rendering with Templates

For more complex rendering (badges, icons, buttons), use a template:

```typescript
import { TemplateRef, ViewChild } from '@angular/core';

export class DirectorListComponent {
  @ViewChild('statusTemplate', { static: true })
  statusTemplate!: TemplateRef<any>;

  columns: ColumnConfig<Director>[] = [];

  ngOnInit() {
    this.columns = [
      {
        key: 'id',
        label: 'ID',
        sortable: true,
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        template: this.statusTemplate,
      },
    ];
  }
}
```

```html
<ng-template #statusTemplate let-director>
  <span class="status-badge" [class.active]="director.status === 'active'">
    {{ director.status }}
  </span>
</ng-template>

<admin-list-detail-shell
  [columns]="columns"
  ...
>
</admin-list-detail-shell>
```

### Adding Filters

Project custom filter UI using the `filter` attribute:

```html
<admin-list-detail-shell
  title="Directors"
  [columns]="columns"
  [dataSource]="dataSource"
  [isLoading]="isLoading"
  [errorMessage]="errorMessage"
>
  <div filter>
    <div class="filter-controls">
      <mat-form-field>
        <mat-label>Search</mat-label>
        <input matInput (keyup)="applyFilter($event)" placeholder="Search directors...">
        <mat-icon matPrefix>search</mat-icon>
      </mat-form-field>

      <mat-form-field>
        <mat-label>Status</mat-label>
        <mat-select (selectionChange)="filterByStatus($event.value)">
          <mat-option value="all">All</mat-option>
          <mat-option value="active">Active</mat-option>
          <mat-option value="inactive">Inactive</mat-option>
        </mat-select>
      </mat-form-field>
    </div>
  </div>
</admin-list-detail-shell>
```

```typescript
applyFilter(event: Event): void {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

filterByStatus(status: string): void {
  if (status === 'all') {
    this.dataSource.filter = '';
  } else {
    this.dataSource.filterPredicate = (data: Director, filter: string) => {
      return data.status.toLowerCase() === filter;
    };
    this.dataSource.filter = status.toLowerCase();
  }
}
```

### Adding a Detail Form/Dialog

Project a detail form or dialog component using the `detail-form` attribute:

```html
<admin-list-detail-shell
  title="Directors"
  [columns]="columns"
  [dataSource]="dataSource"
  [isLoading]="isLoading"
  [errorMessage]="errorMessage"
  (rowClick)="editDirector($event)"
  (addClick)="addDirector()"
>
  <director-form-dialog
    detail-form
    [director]="selectedDirector()"
    (saved)="onDirectorSaved()"
    (cancelled)="onDialogCancelled()"
  >
  </director-form-dialog>
</admin-list-detail-shell>
```

### Custom Empty State

Provide a custom empty state message:

```html
<admin-list-detail-shell
  title="Directors"
  [columns]="columns"
  [dataSource]="dataSource"
  [isLoading]="isLoading"
  [errorMessage]="errorMessage"
>
  <div empty-state class="custom-empty-state">
    <mat-icon>group</mat-icon>
    <h3>No directors found</h3>
    <p>Directors help manage teams and divisions.</p>
    <button mat-raised-button color="primary" (click)="addDirector()">
      Add First Director
    </button>
  </div>
</admin-list-detail-shell>
```

### Adding Actions Column

Enable an actions column for row-level actions:

```html
<admin-list-detail-shell
  title="Directors"
  [columns]="columns"
  [dataSource]="dataSource"
  [isLoading]="isLoading"
  [errorMessage]="errorMessage"
  [showActionsColumn]="true"
  [rowClickable]="false"
>
  <ng-template actions let-row>
    <button mat-icon-button (click)="editDirector(row)">
      <mat-icon>edit</mat-icon>
    </button>
    <button mat-icon-button (click)="deleteDirector(row)">
      <mat-icon>delete</mat-icon>
    </button>
  </ng-template>
</admin-list-detail-shell>
```

Note: When using an actions column, you may want to set `[rowClickable]="false"` to prevent row clicks from conflicting with action buttons.

### Customizing Pagination

Configure pagination options:

```html
<admin-list-detail-shell
  title="Directors"
  [columns]="columns"
  [dataSource]="dataSource"
  [pageSizeOptions]="[5, 10, 25, 50]"
  [defaultPageSize]="10"
  [paginatorAriaLabel]="'Navigate director pages'"
  ...
>
</admin-list-detail-shell>
```

### Disabling the Add Button

Hide the add button if users don't have permission to create records:

```html
<admin-list-detail-shell
  title="Directors"
  [columns]="columns"
  [dataSource]="dataSource"
  [showAddButton]="userCanAddDirectors()"
  ...
>
</admin-list-detail-shell>
```

### Customizing Button Text

Change the add button text to match your domain:

```html
<admin-list-detail-shell
  title="Directors"
  [columns]="columns"
  [dataSource]="dataSource"
  [addButtonText]="'Create Director'"
  ...
>
</admin-list-detail-shell>
```

### Disabling Row Clicks

Disable row clicks if you only want actions through an actions column:

```html
<admin-list-detail-shell
  title="Directors"
  [columns]="columns"
  [dataSource]="dataSource"
  [rowClickable]="false"
  ...
>
</admin-list-detail-shell>
```

## Complete Example

Here's a complete example of a director list component using all features:

**director-list.component.ts:**

```typescript
import { Component, signal, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { AdminListDetailShell } from '@admin/shared/admin-list-detail-shell';
import { ColumnConfig } from '@admin/shared/models';
import { DirectorService } from '@services/director.service';
import { Director } from '@models/director';

@Component({
  selector: 'director-list',
  standalone: true,
  imports: [
    CommonModule,
    AdminListDetailShell,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './director-list.component.html',
})
export class DirectorListComponent implements OnInit {
  @ViewChild('statusTemplate', { static: true })
  statusTemplate!: TemplateRef<any>;

  dataSource = new MatTableDataSource<Director>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  selectedDirector = signal<Director | null>(null);

  columns: ColumnConfig<Director>[] = [];

  constructor(private directorService: DirectorService) {}

  ngOnInit(): void {
    this.columns = [
      {
        key: 'id',
        label: 'ID',
        sortable: true,
        width: '80px',
      },
      {
        key: 'fullName',
        label: 'Full Name',
        sortable: true,
        valueGetter: (director: Director) =>
          `${director.firstName} ${director.lastName}`,
      },
      {
        key: 'email',
        label: 'Email',
        sortable: true,
      },
      {
        key: 'phone',
        label: 'Phone',
        sortable: false,
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        template: this.statusTemplate,
      },
    ];

    this.loadDirectors();
  }

  loadDirectors(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.directorService.getDirectors().subscribe({
      next: (directors) => {
        this.dataSource.data = directors;
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading directors:', error);
        this.errorMessage.set('Failed to load directors. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterByStatus(status: string): void {
    if (status === 'all') {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filterPredicate = (data: Director, filter: string) => {
        return data.status.toLowerCase() === filter;
      };
      this.dataSource.filter = status.toLowerCase();
    }
  }

  editDirector(director: Director): void {
    this.selectedDirector.set(director);
    // Open dialog or navigate to edit page
  }

  addDirector(): void {
    this.selectedDirector.set(null);
    // Open dialog or navigate to add page
  }

  deleteDirector(director: Director): void {
    if (confirm(`Are you sure you want to delete ${director.firstName} ${director.lastName}?`)) {
      this.directorService.deleteDirector(director.id).subscribe({
        next: () => {
          this.loadDirectors();
        },
        error: (error) => {
          console.error('Error deleting director:', error);
          this.errorMessage.set('Failed to delete director. Please try again.');
        },
      });
    }
  }

  onDirectorSaved(): void {
    this.selectedDirector.set(null);
    this.loadDirectors();
  }

  onDialogCancelled(): void {
    this.selectedDirector.set(null);
  }
}
```

**director-list.component.html:**

```html
<ng-template #statusTemplate let-director>
  <span
    class="status-badge"
    [class.active]="director.status === 'active'"
    [class.inactive]="director.status === 'inactive'"
  >
    {{ director.status | titlecase }}
  </span>
</ng-template>

<admin-list-detail-shell
  title="Directors"
  [columns]="columns"
  [dataSource]="dataSource"
  [isLoading]="isLoading"
  [errorMessage]="errorMessage"
  [addButtonText]="'Create Director'"
  [pageSizeOptions]="[10, 25, 50]"
  [defaultPageSize]="25"
  [paginatorAriaLabel]="'Navigate director pages'"
  (rowClick)="editDirector($event)"
  (addClick)="addDirector()"
>
  <!-- Filter Section -->
  <div filter>
    <div class="filter-controls">
      <mat-form-field>
        <mat-label>Search</mat-label>
        <input
          matInput
          (keyup)="applyFilter($event)"
          placeholder="Search by name, email, or phone..."
        >
        <mat-icon matPrefix>search</mat-icon>
      </mat-form-field>

      <mat-form-field>
        <mat-label>Status</mat-label>
        <mat-select (selectionChange)="filterByStatus($event.value)">
          <mat-option value="all">All</mat-option>
          <mat-option value="active">Active</mat-option>
          <mat-option value="inactive">Inactive</mat-option>
        </mat-select>
      </mat-form-field>
    </div>
  </div>

  <!-- Detail Form -->
  <director-form-dialog
    detail-form
    [director]="selectedDirector()"
    (saved)="onDirectorSaved()"
    (cancelled)="onDialogCancelled()"
  >
  </director-form-dialog>
</admin-list-detail-shell>
```

## API Reference

### Inputs

| Input | Type | Default | Required | Description |
|-------|------|---------|----------|-------------|
| `title` | `string` | - | Yes | Page title displayed in header |
| `columns` | `ColumnConfig<T>[]` | - | Yes | Column configurations for the table |
| `dataSource` | `MatTableDataSource<T>` | - | Yes | Data source for the table |
| `showAddButton` | `boolean` | `true` | No | Whether to show the "Add" button |
| `addButtonText` | `string` | `'Add New'` | No | Text for the "Add" button |
| `rowClickable` | `boolean` | `true` | No | Whether rows are clickable |
| `showActionsColumn` | `boolean` | `false` | No | Whether to show an actions column |
| `pageSizeOptions` | `number[]` | `[10, 25, 50, 100]` | No | Page size options for pagination |
| `defaultPageSize` | `number` | `25` | No | Default page size |
| `paginatorAriaLabel` | `string` | `'Select page'` | No | ARIA label for the paginator |
| `isLoading` | `Signal<boolean>` | `signal(false)` | No | Loading state signal |
| `errorMessage` | `Signal<string \| null>` | `signal(null)` | No | Error message signal |

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `rowClick` | `EventEmitter<T>` | Emitted when a row is clicked (if `rowClickable` is true) |
| `addClick` | `EventEmitter<void>` | Emitted when the "Add" button is clicked |

### Content Projection Slots

| Selector | Description |
|----------|-------------|
| `[filter]` | Projects custom filter UI above the table |
| `[actions]` | Projects action buttons in the actions column (requires `showActionsColumn=true`) |
| `[empty-state]` | Projects custom empty state when no data is available |
| `[detail-form]` | Projects detail form/dialog component |

### ColumnConfig Interface

```typescript
interface ColumnConfig<T> {
  key: string;                          // Property key from data model
  label: string;                        // Column header label
  sortable?: boolean;                   // Enable sorting (default: false)
  valueGetter?: (row: T) => string | number; // Transform data before display
  template?: TemplateRef<any>;          // Custom rendering template
  cellClass?: string;                   // CSS class for table cells
  headerClass?: string;                 // CSS class for header cell
  minWidth?: string;                    // Minimum column width
  maxWidth?: string;                    // Maximum column width
  width?: string;                       // Fixed column width
  visible?: boolean;                    // Show/hide column (default: true)
}
```

## Styling

The component comes with default styles, but you can customize them:

### Component Styles

The main styles are defined in `admin-list-detail-shell.scss` and include:
- Layout and spacing
- Header and button styling
- Filter section styling
- Error message styling
- Loading spinner styling
- Table styling with hover effects
- Empty state styling
- Responsive adjustments for mobile
- Print styles

### Custom Styling

You can add custom styles in your component's SCSS file:

```scss
admin-list-detail-shell {
  .filter-controls {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;

    mat-form-field {
      flex: 1;
      min-width: 200px;
    }
  }

  .status-badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;

    &.active {
      background-color: #4caf50;
      color: white;
    }

    &.inactive {
      background-color: #9e9e9e;
      color: white;
    }
  }
}
```

## Best Practices

1. **Use Signals for State**: Pass signals for `isLoading` and `errorMessage` to enable reactive updates
2. **Type Safety**: Define proper TypeScript interfaces for your data models
3. **Column Configuration**: Keep column configurations in the component class, not the template
4. **Error Handling**: Always provide user-friendly error messages
5. **Loading States**: Show loading state during async operations
6. **Accessibility**: Use semantic HTML and provide ARIA labels
7. **Performance**: Use `OnPush` change detection in your consuming components
8. **Filtering**: Implement custom filter predicates for complex filtering logic
9. **Pagination**: Choose appropriate page sizes based on your data volume
10. **Mobile First**: Test responsive behavior on different screen sizes

## Troubleshooting

### Table doesn't update when data changes

Make sure you're updating the `dataSource.data` property:

```typescript
// Correct
this.dataSource.data = newData;

// Incorrect
this.dataSource = new MatTableDataSource(newData);
```

### Sorting doesn't work

Ensure columns have `sortable: true` in the configuration:

```typescript
columns: ColumnConfig<Director>[] = [
  { key: 'name', label: 'Name', sortable: true }, // ✓ Correct
  { key: 'email', label: 'Email' }, // ✗ Not sortable
];
```

### Filter content not showing

Make sure you're using the `filter` attribute on the projected content:

```html
<!-- Correct -->
<div filter>Filter UI</div>

<!-- Incorrect -->
<div>Filter UI</div>
```

### Actions column not showing

Enable the actions column with `[showActionsColumn]="true"`:

```html
<admin-list-detail-shell
  [showActionsColumn]="true"
  ...
>
  <ng-template actions let-row>
    <!-- Action buttons -->
  </ng-template>
</admin-list-detail-shell>
```

### Custom template not rendering

Ensure you're using `@ViewChild` with `{ static: true }` and initializing columns in `ngOnInit`:

```typescript
@ViewChild('myTemplate', { static: true })
myTemplate!: TemplateRef<any>;

ngOnInit() {
  this.columns = [
    { key: 'field', label: 'Field', template: this.myTemplate },
  ];
}
```

## Migration Guide

### From Existing List Components

To migrate an existing list component to use AdminListDetailShell:

1. **Extract column configuration** from your table template
2. **Move filter UI** to use content projection with `[filter]` attribute
3. **Update state management** to use signals for loading and error states
4. **Replace table template** with `<admin-list-detail-shell>` component
5. **Move event handlers** to use `(rowClick)` and `(addClick)` outputs
6. **Project detail forms** using `[detail-form]` attribute
7. **Update unit tests** to test the new structure

See the story documentation (APMT-001) for detailed migration examples for People and Households modules.

## Support

For questions or issues with the AdminListDetailShell component, please:
- Check this documentation first
- Review the unit tests for usage examples
- Refer to the story documentation (APMT-001)
- Contact the development team

## Related Documentation

- [Story APMT-001](../../../../docs/stories/APMT-001-create-reusable-list-detail-framework.md) - Implementation details and acceptance criteria
- [Angular Material Table](https://material.angular.io/components/table/overview) - MatTable documentation
- [Angular Signals](https://angular.dev/guide/signals) - Signals documentation
- [Content Projection](https://angular.dev/guide/components/content-projection) - ng-content documentation
