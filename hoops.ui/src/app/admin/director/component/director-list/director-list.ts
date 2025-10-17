import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewInit,
  inject,
  effect,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Director } from '@app/domain/director';
import { DirectorService } from '@app/services/director.service';
import { Router } from '@angular/router';

@Component({
  selector: 'csbc-director-list',
  templateUrl: './director-list.html',
  styleUrls: ['./director-list.scss', '../../../../shared/scss/tables.scss'],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
  ],
  providers: [MatSort, MatPaginator],
})
export class DirectorList implements OnInit, AfterViewInit {
  @ViewChild('directorPaginator') paginator: MatPaginator =
    inject(MatPaginator);
  @ViewChild(MatSort) sort: MatSort = inject(MatSort);

  private directorService = inject(DirectorService);
  private router = inject(Router);

  dataSource = new MatTableDataSource<Director>([]);
  displayedColumns = ['name', 'title'];
  showFirstLastButtons = true;
  pageSize = 25;
  errorMessage: string | undefined;

  // Support both input and service-based data loading
  _directors: Director[] = [];
  get directors() {
    return this._directors;
  }
  @Input() set directors(directors: Director[]) {
    this._directors = directors;
    this.dataSource.data = directors;
  }

  constructor() {
    // Effect to automatically update table when directors signal changes
    effect(() => {
      const directors = this.directorService.directorsSignal();
      if (directors && directors.length > 0) {
        this.dataSource.data = directors;
      }
    });
  }

  ngOnInit() {
    // Load directors if not provided via input
    if (!this._directors || this._directors.length === 0) {
      this.loadDirectors();
    }
  }

  ngAfterViewInit() {
    // Configure sorting and pagination
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Set default sort
    if (this.sort) {
      this.sort.active = 'name';
      this.sort.direction = 'asc';
    }

    // Custom sort accessor for the name column (combines firstName and lastName)
    this.dataSource.sortingDataAccessor = (
      director: Director,
      property: string
    ) => {
      switch (property) {
        case 'name':
          return `${director.lastName}, ${director.firstName}`.toLowerCase();
        case 'title':
          return director.title?.toLowerCase() || '';
        default:
          return (director as any)[property];
      }
    };
  }

  loadDirectors() {
    this.directorService.fetchDirectors();
  }

  /**
   * Navigate to director edit page
   */
  editDirector(director: Director): void {
    // TODO: Implement navigation to edit form
    // this.router.navigate(['/admin/directors/edit', director.id]);
  }

  /**
   * Add a new director
   */
  addDirector(): void {
    // TODO: Implement navigation to add form
    // this.router.navigate(['/admin/directors/add']);
  }

  /**
   * Get the full name of a director
   */
  getDirectorName(director: Director): string {
    return `${director.firstName} ${director.lastName}`;
  }

  /**
   * Refresh the director list
   */
  refreshList(): void {
    this.loadDirectors();
  }
}
