import { Component, computed, inject, signal } from '@angular/core';
import { BaseList } from '@app/admin/shared/BaseList';
import { TableColumn, GenericMatTableComponent } from '@app/admin/shared/generic-mat-table/generic-mat-table';
import { DirectorListItem } from '@app/domain/director';
import { Person } from '@app/domain/person';
import {
  DirectorFilterCriteria,
  DirectorFilters,
} from '../director-filters/director-filters';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DirectorService } from '@app/services/director.service';
import { ListPageShellComponent } from '@app/admin/shared/list-page-shell/ListPageShell';

@Component({
  selector: 'csbc-director-list',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    GenericMatTableComponent,
    ListPageShellComponent,
    DirectorFilters,
  ],
  templateUrl: './director-list.html',
  styleUrl: './director-list.scss',
})
export class DirectorList extends BaseList<DirectorListItem> {
  private directorService = inject(DirectorService);

  override get basePath(): string {
    return '/director';
  }

  columns: TableColumn<DirectorListItem>[] = [
    { key: 'name', header: 'Name', field: 'name' },
    { key: 'title', header: 'Title', field: 'title' },
  ];

  filters = signal<DirectorFilterCriteria>({});

  // Computed signal to convert Directors to DirectorListItems
  directors = computed(() => {
    const directorsData = this.directorService.directorsSignal();
    if (!directorsData) return [];

    return directorsData.map(director => ({
      id: director.id,
      name: director.name,
      title: director.title,
    } as DirectorListItem));
  });

  // Computed signal for filtered directors
  filteredDirectors = computed(() => {
    const directors = this.directors();
    const filterCriteria = this.filters();

    if (!filterCriteria || Object.keys(filterCriteria).length === 0) {
      return directors;
    }

    // Apply filters here based on your filter criteria
    return directors.filter(director => {
      // Add your filtering logic based on filterCriteria
      return true;
    });
  });

  onFilterChange(filters: DirectorFilterCriteria): void {
    this.filters.set(filters);
  }

  onRowClick(item: DirectorListItem): void {
    this.navigateToDetail(item);
  }
}
