import { Component, signal } from '@angular/core';
import { BaseList } from '@app/admin/shared/BaseList';
import { TableColumn } from '@app/admin/shared/GenericMatTable';
import { Director } from '@app/domain/director';
import { Person } from '@app/domain/person';
import {
  DirectorFilterCriteria,
  DirectorFilters,
} from '../director-filters/director-filters';

@Component({
  selector: 'csbc-director-list',
  imports: [],
  templateUrl: './director-list.component.html',
  styleUrl: './director-list.component.scss',
})
export class DirectorList extends BaseList<Director> {
  override get basePath(): string {
    return '/people';
  }

  columns: TableColumn<Person>[] = [
    { key: 'name', header: 'Name', field: 'name' },
    { key: 'email', header: 'Email', field: 'email' },
  ];

  filters = signal<DirectorFilterCriteria>({});

  onFilterChange(filters: DirectorFilterCriteria): void {
    this.filters.set(filters);
  }
}
