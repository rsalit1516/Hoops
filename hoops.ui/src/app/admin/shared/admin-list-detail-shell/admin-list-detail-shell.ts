import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  ContentChild,
  TemplateRef,
  signal,
  Signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ColumnConfig } from '../models';

/**
 * Reusable admin list-detail shell component
 *
 * Provides a consistent structure for admin list-detail pages including:
 * - Configurable header with title and "Add" button
 * - Filter section using content projection
 * - Material table with sorting and pagination
 * - Detail form/dialog using content projection
 * - Loading states and error handling
 * - Empty state messaging
 *
 * @template T The type of data displayed in the table
 *
 * @example
 * ```typescript
 * <admin-list-detail-shell
 *   title="Directors"
 *   [columns]="columns"
 *   [dataSource]="dataSource"
 *   [isLoading]="isLoading"
 *   [errorMessage]="errorMessage"
 *   (rowClick)="editDirector($event)"
 *   (addClick)="addDirector()"
 * >
 *   <div filter>
 *     <!-- Custom filter UI goes here -->
 *   </div>
 *   <director-form-dialog detail-form [director]="selectedDirector()">
 *   </director-form-dialog>
 * </admin-list-detail-shell>
 * ```
 */
@Component({
  selector: 'admin-list-detail-shell',
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
  templateUrl: './admin-list-detail-shell.html',
  styleUrls: [
    './admin-list-detail-shell.scss',
    '../../../shared/scss/tables.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminListDetailShell<T> implements AfterViewInit {
  // Configuration inputs
  /** Title displayed in the header */
  @Input({ required: true }) title!: string;

  /** Column configurations for the table */
  @Input({ required: true }) columns!: ColumnConfig<T>[];

  /** Data source for the table */
  @Input({ required: true }) dataSource!: MatTableDataSource<T>;

  /** Whether to show the "Add" button */
  @Input() showAddButton = true;

  /** Text for the "Add" button */
  @Input() addButtonText = 'Add New';

  /** Whether rows are clickable */
  @Input() rowClickable = true;

  /** Whether to show an actions column */
  @Input() showActionsColumn = false;

  /** Page size options for pagination */
  @Input() pageSizeOptions = [10, 25, 50, 100];

  /** Default page size */
  @Input() defaultPageSize = 25;

  /** ARIA label for the paginator */
  @Input() paginatorAriaLabel = 'Select page';

  // State signals
  /** Loading state signal */
  @Input() isLoading: Signal<boolean> = signal(false);

  /** Error message signal */
  @Input() errorMessage: Signal<string | null> = signal(null);

  // Events
  /** Emitted when a row is clicked */
  @Output() rowClick = new EventEmitter<T>();

  /** Emitted when the "Add" button is clicked */
  @Output() addClick = new EventEmitter<void>();

  // ViewChildren for Material components
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // ContentChildren for projected content
  @ContentChild('filter', { read: TemplateRef }) filterContent?: TemplateRef<any>;

  /**
   * Check if filter content is projected
   */
  hasFilterContent = computed(() => !!this.filterContent);

  /**
   * Get array of column keys to display
   */
  displayedColumns = computed(() => {
    const cols = this.columns
      .filter(c => c.visible !== false)
      .map(c => c.key);

    if (this.showActionsColumn) {
      cols.push('actions');
    }

    return cols;
  });

  /**
   * Initialize table sort and pagination after view init
   */
  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  /**
   * Handle row click event
   * @param row The clicked row data
   */
  onRowClick(row: T): void {
    if (this.rowClickable) {
      this.rowClick.emit(row);
    }
  }

  /**
   * Handle add button click event
   */
  onAdd(): void {
    this.addClick.emit();
  }
}
