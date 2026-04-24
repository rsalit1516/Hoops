import {
  AfterViewInit,
  Component,
  effect,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { PaginationPreferencesService } from '@app/services/pagination-preferences.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DocumentMetadata } from '@app/domain/document';
import { AdminDocumentStateService } from '../admin-document-state.service';

@Component({
  selector: 'app-admin-document-list',
  standalone: true,
  imports: [
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
  ],
  templateUrl: './admin-document-list.html',
  styleUrls: ['../../../shared/scss/tables.scss', '../../admin.scss'],
  providers: [MatSort, MatPaginator],
})
export class AdminDocumentList implements OnInit, AfterViewInit {
  private readonly stateService = inject(AdminDocumentStateService);
  private readonly router = inject(Router);
  private readonly prefs = inject(PaginationPreferencesService);

  readonly paginator = viewChild<MatPaginator>('docPaginator');
  readonly sort = viewChild(MatSort);

  displayColumns = ['title', 'section', 'description', 'sortOrder'];
  pageSize = this.prefs.getPageSize(10);
  showFirstLastButtons = true;

  dataSource = new MatTableDataSource<DocumentMetadata>([]);

  private docsEffect = effect(() => {
    this.dataSource.data = this.stateService.documents();
  });

  ngOnInit(): void {
    this.stateService.fetchDocuments();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator() ?? null;
    this.dataSource.sort = this.sort() ?? null;
  }

  onPage(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.prefs.savePageSize(event.pageSize);
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
