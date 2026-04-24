import {
  Component,
  Input,
  OnInit,
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
  inject,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { PaginationPreferencesService } from '@app/services/pagination-preferences.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// generic-mat-table.component.ts
@Component({
  selector: 'app-generic-mat-table',
  templateUrl: './generic-mat-table.html',
  styleUrls: ['./generic-mat-table.scss', '../../../shared/scss/tables.scss'],
  imports: [
    NgTemplateOutlet,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
],
})
export class GenericMatTableComponent<T> implements OnInit, AfterViewInit {
  private readonly prefs = inject(PaginationPreferencesService);

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

  ngOnInit(): void {
    // Apply stored preference, using the @Input pageSize as fallback
    this.pageSize = this.prefs.getPageSize(this.pageSize);
  }

  ngOnChanges() {
    this.dataSource.data = this.data;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onPage(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.prefs.savePageSize(event.pageSize);
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
