import { Component, effect, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { PaginationPreferencesService } from '@app/services/pagination-preferences.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DocumentMetadata } from '@app/domain/document';
import { AdminDocumentStateService } from '../admin-document-state.service';
import {
  GenericMatTableComponent,
  TableColumn,
} from '../../shared/generic-mat-table/generic-mat-table';

@Component({
  selector: 'app-admin-document-list',
  standalone: true,
  imports: [MatButtonModule, MatToolbarModule, GenericMatTableComponent],
  templateUrl: './admin-document-list.html',
  styleUrls: ['../../../shared/scss/tables.scss', '../../admin.scss'],
})
export class AdminDocumentList implements OnInit {
  private readonly stateService = inject(AdminDocumentStateService);
  private readonly router = inject(Router);
  private readonly prefs = inject(PaginationPreferencesService);

  columns: TableColumn<DocumentMetadata>[] = [
    { key: 'title', header: 'Title', field: 'title' },
    { key: 'section', header: 'Section', field: 'section' },
    { key: 'description', header: 'Description', field: 'description' },
    { key: 'sortOrder', header: 'Sort Order', field: 'sortOrder' },
  ];
  pageSize = this.prefs.getPageSize(10);

  dataSource = new MatTableDataSource<DocumentMetadata>([]);

  private docsEffect = effect(() => {
    this.dataSource.data = this.stateService.documents();
  });

  ngOnInit(): void {
    this.stateService.fetchDocuments();
  }

  addNew(): void {
    this.stateService.selectDocument(null);
    this.router.navigate(['/admin/documents/detail']);
  }

  edit(row: DocumentMetadata): void {
    this.stateService.selectDocument(row);
    this.router.navigate(['/admin/documents/detail']);
  }
}
