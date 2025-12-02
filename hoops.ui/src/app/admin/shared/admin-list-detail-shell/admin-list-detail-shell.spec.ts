import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, signal, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AdminListDetailShell } from './admin-list-detail-shell';
import { ColumnConfig } from '../models';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

interface TestData {
  id: number;
  name: string;
  email: string;
  status: string;
}

describe('AdminListDetailShell', () => {
  let component: AdminListDetailShell<TestData>;
  let fixture: ComponentFixture<AdminListDetailShell<TestData>>;
  let compiled: HTMLElement;

  const mockData: TestData[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active' },
  ];

  const defaultColumns: ColumnConfig<TestData>[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'status', label: 'Status', sortable: false },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminListDetailShell, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminListDetailShell<TestData>);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;

    // Set required inputs
    component.title = 'Test List';
    component.columns = defaultColumns;
    component.dataSource = new MatTableDataSource(mockData);
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should have default input values', () => {
      expect(component.showAddButton).toBe(true);
      expect(component.addButtonText).toBe('Add New');
      expect(component.rowClickable).toBe(true);
      expect(component.showActionsColumn).toBe(false);
      expect(component.pageSizeOptions).toEqual([10, 25, 50, 100]);
      expect(component.defaultPageSize).toBe(25);
      expect(component.paginatorAriaLabel).toBe('Select page');
    });

    it('should accept custom configuration values', () => {
      component.showAddButton = false;
      component.addButtonText = 'Create New';
      component.rowClickable = false;
      component.showActionsColumn = true;
      component.pageSizeOptions = [5, 10, 20];
      component.defaultPageSize = 10;
      component.paginatorAriaLabel = 'Custom label';

      expect(component.showAddButton).toBe(false);
      expect(component.addButtonText).toBe('Create New');
      expect(component.rowClickable).toBe(false);
      expect(component.showActionsColumn).toBe(true);
      expect(component.pageSizeOptions).toEqual([5, 10, 20]);
      expect(component.defaultPageSize).toBe(10);
      expect(component.paginatorAriaLabel).toBe('Custom label');
    });

    it('should initialize with loading state', () => {
      const loadingSignal = signal(true);
      component.isLoading = loadingSignal;
      fixture.detectChanges();

      const loadingContainer = compiled.querySelector('.loading-container');
      expect(loadingContainer).toBeTruthy();
    });

    it('should initialize with error state', () => {
      const errorSignal = signal('An error occurred');
      component.errorMessage = errorSignal;
      fixture.detectChanges();

      const errorMessage = compiled.querySelector('.error-message');
      expect(errorMessage).toBeTruthy();
      expect(errorMessage?.textContent).toContain('An error occurred');
    });
  });

  describe('Table Display', () => {
    beforeEach(() => {
      component.isLoading = signal(false);
      component.errorMessage = signal(null);
      fixture.detectChanges();
    });

    it('should render the title', () => {
      const title = compiled.querySelector('.page-title');
      expect(title?.textContent).toContain('Test List');
    });

    it('should render the add button when showAddButton is true', () => {
      component.showAddButton = true;
      fixture.detectChanges();

      const addButton = compiled.querySelector('.add-button');
      expect(addButton).toBeTruthy();
      expect(addButton?.textContent).toContain('Add New');
    });

    it('should not render the add button when showAddButton is false', () => {
      component.showAddButton = false;
      fixture.detectChanges();

      const addButton = compiled.querySelector('.add-button');
      expect(addButton).toBeFalsy();
    });

    it('should render custom add button text', () => {
      component.addButtonText = 'Create Director';
      fixture.detectChanges();

      const addButton = compiled.querySelector('.add-button');
      expect(addButton?.textContent).toContain('Create Director');
    });

    it('should render table with correct columns', () => {
      const headers = compiled.querySelectorAll('th.mat-header-cell');
      expect(headers.length).toBe(4); // 4 columns

      expect(headers[0].textContent).toContain('ID');
      expect(headers[1].textContent).toContain('Name');
      expect(headers[2].textContent).toContain('Email');
      expect(headers[3].textContent).toContain('Status');
    });

    it('should render table rows with data', () => {
      const rows = compiled.querySelectorAll('tr.mat-row');
      expect(rows.length).toBe(3); // 3 data rows
    });

    it('should render table cells with correct data', () => {
      const firstRow = compiled.querySelector('tr.mat-row');
      const cells = firstRow?.querySelectorAll('td.mat-cell');

      expect(cells?.length).toBe(4);
      expect(cells?.[0].textContent?.trim()).toBe('1');
      expect(cells?.[1].textContent?.trim()).toBe('John Doe');
      expect(cells?.[2].textContent?.trim()).toBe('john@example.com');
      expect(cells?.[3].textContent?.trim()).toBe('Active');
    });

    it('should render actions column when showActionsColumn is true', () => {
      component.showActionsColumn = true;
      fixture.detectChanges();

      const actionsHeader = compiled.querySelector('.actions-header');
      expect(actionsHeader).toBeTruthy();
    });

    it('should not render actions column when showActionsColumn is false', () => {
      component.showActionsColumn = false;
      fixture.detectChanges();

      const actionsHeader = compiled.querySelector('.actions-header');
      expect(actionsHeader).toBeFalsy();
    });
  });

  describe('Computed Signals', () => {
    it('should compute displayedColumns correctly without actions', () => {
      component.showActionsColumn = false;
      const displayed = component.displayedColumns();

      expect(displayed).toEqual(['id', 'name', 'email', 'status']);
    });

    it('should compute displayedColumns correctly with actions', () => {
      component.showActionsColumn = true;
      const displayed = component.displayedColumns();

      expect(displayed).toEqual(['id', 'name', 'email', 'status', 'actions']);
    });

    it('should filter out invisible columns', () => {
      component.columns = [
        ...defaultColumns,
        { key: 'hidden', label: 'Hidden', visible: false },
      ];
      const displayed = component.displayedColumns();

      expect(displayed).not.toContain('hidden');
      expect(displayed).toEqual(['id', 'name', 'email', 'status']);
    });

    it('should compute hasFilterContent as false when no filter projected', () => {
      expect(component.hasFilterContent()).toBe(false);
    });
  });

  describe('Column Configuration', () => {
    it('should use valueGetter when provided', () => {
      component.columns = [
        {
          key: 'name',
          label: 'Name',
          valueGetter: (row: TestData) => row.name.toUpperCase(),
        },
      ];
      component.dataSource = new MatTableDataSource(mockData);
      fixture.detectChanges();

      const firstCell = compiled.querySelector('tr.mat-row td.mat-cell');
      expect(firstCell?.textContent?.trim()).toBe('JOHN DOE');
    });

    it('should apply custom cellClass when provided', () => {
      component.columns = [
        { key: 'name', label: 'Name', cellClass: 'custom-cell-class' },
      ];
      fixture.detectChanges();

      const cell = compiled.querySelector('td.custom-cell-class');
      expect(cell).toBeTruthy();
    });

    it('should apply custom headerClass when provided', () => {
      component.columns = [
        { key: 'name', label: 'Name', headerClass: 'custom-header-class' },
      ];
      fixture.detectChanges();

      const header = compiled.querySelector('th.custom-header-class');
      expect(header).toBeTruthy();
    });

    it('should apply width styles when provided', () => {
      component.columns = [
        {
          key: 'name',
          label: 'Name',
          width: '200px',
          minWidth: '100px',
          maxWidth: '300px',
        },
      ];
      fixture.detectChanges();

      const header = compiled.querySelector('th.mat-header-cell') as HTMLElement;
      expect(header.style.width).toBe('200px');
      expect(header.style.minWidth).toBe('100px');
      expect(header.style.maxWidth).toBe('300px');
    });

    it('should enable sorting for sortable columns', () => {
      fixture.detectChanges();

      const sortableHeaders = compiled.querySelectorAll('[mat-sort-header]');
      expect(sortableHeaders.length).toBe(3); // id, name, email are sortable
    });

    it('should not enable sorting for non-sortable columns', () => {
      fixture.detectChanges();

      const allHeaders = compiled.querySelectorAll('th.mat-header-cell');
      const statusHeader = allHeaders[3]; // status column is not sortable
      const sortHeader = statusHeader.querySelector('[mat-sort-header]');
      expect(sortHeader).toBeFalsy();
    });
  });

  describe('Event Emissions', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should emit addClick when add button is clicked', () => {
      spyOn(component.addClick, 'emit');

      const addButton = compiled.querySelector('.add-button') as HTMLButtonElement;
      addButton.click();

      expect(component.addClick.emit).toHaveBeenCalled();
    });

    it('should emit rowClick when a row is clicked', () => {
      spyOn(component.rowClick, 'emit');
      component.rowClickable = true;
      fixture.detectChanges();

      const firstRow = compiled.querySelector('tr.mat-row') as HTMLElement;
      firstRow.click();

      expect(component.rowClick.emit).toHaveBeenCalledWith(mockData[0]);
    });

    it('should not emit rowClick when rowClickable is false', () => {
      spyOn(component.rowClick, 'emit');
      component.rowClickable = false;
      fixture.detectChanges();

      const firstRow = compiled.querySelector('tr.mat-row') as HTMLElement;
      firstRow.click();

      expect(component.rowClick.emit).not.toHaveBeenCalled();
    });

    it('should call onRowClick method when row is clicked', () => {
      spyOn(component, 'onRowClick');
      component.rowClickable = true;
      fixture.detectChanges();

      const firstRow = compiled.querySelector('tr.mat-row') as HTMLElement;
      firstRow.click();

      expect(component.onRowClick).toHaveBeenCalled();
    });

    it('should call onAdd method when add button is clicked', () => {
      spyOn(component, 'onAdd');

      const addButton = compiled.querySelector('.add-button') as HTMLButtonElement;
      addButton.click();

      expect(component.onAdd).toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when isLoading is true', () => {
      component.isLoading = signal(true);
      component.errorMessage = signal(null);
      fixture.detectChanges();

      const loadingContainer = compiled.querySelector('.loading-container');
      const spinner = compiled.querySelector('mat-spinner');

      expect(loadingContainer).toBeTruthy();
      expect(spinner).toBeTruthy();
    });

    it('should show loading text when isLoading is true', () => {
      component.isLoading = signal(true);
      component.errorMessage = signal(null);
      fixture.detectChanges();

      const loadingText = compiled.querySelector('.loading-container p');
      expect(loadingText?.textContent).toContain('Loading...');
    });

    it('should hide table when isLoading is true', () => {
      component.isLoading = signal(true);
      component.errorMessage = signal(null);
      fixture.detectChanges();

      const table = compiled.querySelector('table');
      expect(table).toBeFalsy();
    });

    it('should show table when isLoading is false', () => {
      component.isLoading = signal(false);
      component.errorMessage = signal(null);
      fixture.detectChanges();

      const table = compiled.querySelector('table');
      expect(table).toBeTruthy();
    });
  });

  describe('Error State', () => {
    it('should show error message when errorMessage is set', () => {
      component.isLoading = signal(false);
      component.errorMessage = signal('Failed to load data');
      fixture.detectChanges();

      const errorMessage = compiled.querySelector('.error-message');
      expect(errorMessage).toBeTruthy();
      expect(errorMessage?.textContent).toContain('Failed to load data');
    });

    it('should show error icon when errorMessage is set', () => {
      component.isLoading = signal(false);
      component.errorMessage = signal('Failed to load data');
      fixture.detectChanges();

      const errorIcon = compiled.querySelector('.error-message mat-icon');
      expect(errorIcon).toBeTruthy();
      expect(errorIcon?.textContent).toContain('error');
    });

    it('should hide table when errorMessage is set', () => {
      component.isLoading = signal(false);
      component.errorMessage = signal('Failed to load data');
      fixture.detectChanges();

      const table = compiled.querySelector('table');
      expect(table).toBeFalsy();
    });

    it('should not show error message when errorMessage is null', () => {
      component.isLoading = signal(false);
      component.errorMessage = signal(null);
      fixture.detectChanges();

      const errorMessage = compiled.querySelector('.error-message');
      expect(errorMessage).toBeFalsy();
    });

    it('should have proper ARIA role for error message', () => {
      component.errorMessage = signal('Error occurred');
      fixture.detectChanges();

      const errorDiv = compiled.querySelector('.error-message');
      expect(errorDiv?.getAttribute('role')).toBe('alert');
    });
  });

  describe('Empty State', () => {
    beforeEach(() => {
      component.dataSource = new MatTableDataSource([]);
      component.isLoading = signal(false);
      component.errorMessage = signal(null);
      fixture.detectChanges();
    });

    it('should show default empty state when no data', () => {
      const emptyState = compiled.querySelector('.default-empty-state');
      expect(emptyState).toBeTruthy();
    });

    it('should show empty state icon', () => {
      const icon = compiled.querySelector('.default-empty-state mat-icon');
      expect(icon).toBeTruthy();
      expect(icon?.textContent).toContain('inbox');
    });

    it('should show empty state message', () => {
      const message = compiled.querySelector('.default-empty-state p');
      expect(message?.textContent).toContain('No records found');
    });

    it('should show empty state hint when showAddButton is true', () => {
      component.showAddButton = true;
      fixture.detectChanges();

      const hint = compiled.querySelector('.empty-state-hint');
      expect(hint).toBeTruthy();
      expect(hint?.textContent).toContain('Click "Add New" to get started');
    });

    it('should not show empty state hint when showAddButton is false', () => {
      component.showAddButton = false;
      fixture.detectChanges();

      const hint = compiled.querySelector('.empty-state-hint');
      expect(hint).toBeFalsy();
    });

    it('should show custom add button text in empty state hint', () => {
      component.addButtonText = 'Create Director';
      fixture.detectChanges();

      const hint = compiled.querySelector('.empty-state-hint');
      expect(hint?.textContent).toContain('Click "Create Director" to get started');
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      component.isLoading = signal(false);
      component.errorMessage = signal(null);
      fixture.detectChanges();
    });

    it('should render paginator', () => {
      const paginator = compiled.querySelector('mat-paginator');
      expect(paginator).toBeTruthy();
    });

    it('should use custom page size options', () => {
      component.pageSizeOptions = [5, 10, 20];
      fixture.detectChanges();

      expect(component.paginator.pageSizeOptions).toEqual([5, 10, 20]);
    });

    it('should use custom default page size', () => {
      component.defaultPageSize = 50;
      fixture.detectChanges();

      expect(component.paginator.pageSize).toBe(50);
    });

    it('should use custom aria label', () => {
      component.paginatorAriaLabel = 'Custom paginator';
      fixture.detectChanges();

      const paginator = compiled.querySelector('mat-paginator');
      expect(paginator?.getAttribute('aria-label')).toBe('Custom paginator');
    });

    it('should show first/last buttons', () => {
      expect(component.paginator.showFirstLastButtons).toBe(true);
    });
  });

  describe('Sorting and Pagination Integration', () => {
    beforeEach(() => {
      component.isLoading = signal(false);
      component.errorMessage = signal(null);
      fixture.detectChanges();
    });

    it('should wire up sort to dataSource after view init', () => {
      component.ngAfterViewInit();
      expect(component.dataSource.sort).toBe(component.sort);
    });

    it('should wire up paginator to dataSource after view init', () => {
      component.ngAfterViewInit();
      expect(component.dataSource.paginator).toBe(component.paginator);
    });

    it('should handle null dataSource gracefully', () => {
      component.dataSource = null as any;
      expect(() => component.ngAfterViewInit()).not.toThrow();
    });
  });

  describe('Row Styling', () => {
    beforeEach(() => {
      component.isLoading = signal(false);
      component.errorMessage = signal(null);
      fixture.detectChanges();
    });

    it('should apply clickable-row class when rowClickable is true', () => {
      component.rowClickable = true;
      fixture.detectChanges();

      const row = compiled.querySelector('tr.mat-row');
      expect(row?.classList.contains('clickable-row')).toBe(true);
    });

    it('should not apply clickable-row class when rowClickable is false', () => {
      component.rowClickable = false;
      fixture.detectChanges();

      const row = compiled.querySelector('tr.mat-row');
      expect(row?.classList.contains('clickable-row')).toBe(false);
    });
  });

  describe('Content Projection', () => {
    @Component({
      template: `
        <admin-list-detail-shell
          [title]="title"
          [columns]="columns"
          [dataSource]="dataSource"
          [isLoading]="isLoading"
          [errorMessage]="errorMessage"
        >
          <div filter>
            <input type="text" placeholder="Search..." class="filter-input" />
          </div>
          <div detail-form>Detail Form Content</div>
        </admin-list-detail-shell>
      `,
      standalone: true,
      imports: [AdminListDetailShell],
    })
    class TestHostComponent {
      title = 'Test';
      columns = defaultColumns;
      dataSource = new MatTableDataSource(mockData);
      isLoading = signal(false);
      errorMessage = signal(null);
    }

    it('should project filter content', async () => {
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      const filterInput = hostFixture.nativeElement.querySelector('.filter-input');
      expect(filterInput).toBeTruthy();
    });

    it('should show filter section when filter content is projected', async () => {
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      const filterSection = hostFixture.nativeElement.querySelector('.filter-section');
      expect(filterSection).toBeTruthy();
    });

    it('should project detail form content', async () => {
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();
      await hostFixture.whenStable();

      const detailForm = hostFixture.nativeElement.textContent;
      expect(detailForm).toContain('Detail Form Content');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      component.isLoading = signal(false);
      component.errorMessage = signal(null);
      fixture.detectChanges();
    });

    it('should have proper ARIA label on paginator', () => {
      const paginator = compiled.querySelector('mat-paginator');
      expect(paginator?.getAttribute('aria-label')).toBe('Select page');
    });

    it('should use custom ARIA label when provided', () => {
      component.paginatorAriaLabel = 'Navigate directors pages';
      fixture.detectChanges();

      const paginator = compiled.querySelector('mat-paginator');
      expect(paginator?.getAttribute('aria-label')).toBe('Navigate directors pages');
    });

    it('should have role="alert" on error message', () => {
      component.errorMessage = signal('Error');
      fixture.detectChanges();

      const errorDiv = compiled.querySelector('.error-message');
      expect(errorDiv?.getAttribute('role')).toBe('alert');
    });
  });
});
