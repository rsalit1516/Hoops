import { TemplateRef } from '@angular/core';

/**
 * Configuration interface for table columns in admin list-detail views
 * @template T The type of data in the table rows
 */
export interface ColumnConfig<T> {
  /** Unique identifier for the column, used as the key in the data source */
  key: string;

  /** Display label for the column header */
  label: string;

  /** Whether the column supports sorting. Default: false */
  sortable?: boolean;

  /** Optional custom function to extract the display value from a row */
  valueGetter?: (row: T) => string | number;

  /** Optional template ref for custom cell rendering */
  template?: TemplateRef<any>;

  /** CSS class(es) to apply to cells in this column */
  cellClass?: string;

  /** CSS class(es) to apply to the header cell */
  headerClass?: string;

  /** Minimum width for the column */
  minWidth?: string;

  /** Maximum width for the column */
  maxWidth?: string;

  /** Width for the column (e.g., '100px', '20%') */
  width?: string;

  /** Whether to show this column. Default: true */
  visible?: boolean;
}

/**
 * Configuration for empty state display
 */
export interface EmptyStateConfig {
  /** Icon to display in empty state */
  icon?: string;

  /** Message to display when no data is available */
  message: string;

  /** Optional action button text */
  actionText?: string;

  /** Optional action to perform when action button is clicked */
  onAction?: () => void;
}

/**
 * Configuration for the admin list-detail shell
 * @template T The type of data in the table
 */
export interface ListDetailConfig<T> {
  /** Title to display in the header */
  title: string;

  /** Whether to show the "Add" button. Default: true */
  showAddButton?: boolean;

  /** Text for the "Add" button. Default: 'Add New' */
  addButtonText?: string;

  /** Whether rows are clickable. Default: true */
  rowClickable?: boolean;

  /** Whether to show an actions column. Default: false */
  showActionsColumn?: boolean;

  /** Page size options for pagination. Default: [10, 25, 50, 100] */
  pageSizeOptions?: number[];

  /** Default page size. Default: 25 */
  defaultPageSize?: number;

  /** ARIA label for the paginator */
  paginatorAriaLabel?: string;

  /** Column configurations */
  columns: ColumnConfig<T>[];

  /** Empty state configuration */
  emptyState?: EmptyStateConfig;
}
