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

// generic-mat-table.component.ts
@Component({
  selector: 'app-generic-mat-table',
  template: `
    <div class="table-container">
      <table mat-table [dataSource]="dataSource" matSort>
        <!-- Dynamic columns -->
        <ng-container
          *ngFor="let column of columns"
          [matColumnDef]="column.key"
        >
          <th mat-header-cell *matHeaderCellDef mat-sort-header>
            {{ column.header }}
          </th>
          <td mat-cell *matCellDef="let item">
            <!-- Use template if provided, otherwise show field value -->
            <ng-container *ngIf="column.template; else defaultCell">
              <ng-container
                *ngTemplateOutlet="
                  column.template;
                  context: { $implicit: item, column: column }
                "
              >
              </ng-container>
            </ng-container>
            <ng-template #defaultCell>
              {{ getFieldValue(item, column.field) }}
            </ng-template>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr
          mat-row
          *matRowDef="let row; columns: displayedColumns"
          (click)="onRowClick(row)"
          class="clickable-row"
        ></tr>
      </table>

      <mat-paginator
        [pageSizeOptions]="[10, 25, 50, 100]"
        [pageSize]="pageSize"
        showFirstLastButtons
      >
      </mat-paginator>
    </div>
  `,
  styles: [
    `
      .clickable-row {
        cursor: pointer;
      }
      .clickable-row:hover {
        background-color: #f5f5f5;
      }
    `,
  ],
})
export class GenericMatTableComponent<T> implements AfterViewInit {
  @Input() columns: TableColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() pageSize = 25;

  @Output() rowClick = new EventEmitter<T>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<T>();

  get displayedColumns(): string[] {
    return this.columns.map((c) => c.key);
  }

  ngOnChanges() {
    this.dataSource.data = this.data;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onRowClick(row: T): void {
    this.rowClick.emit(row);
  }

  getFieldValue(item: T, field?: string): any {
    if (!field) return '';
    return field.split('.').reduce((obj, key) => obj?.[key], item as any);
  }
}

// Column definition interface
export interface TableColumn<T> {
  key: string;
  header: string;
  field?: string; // For simple field access
  template?: TemplateRef<any>; // For custom rendering
  sortable?: boolean;
}
