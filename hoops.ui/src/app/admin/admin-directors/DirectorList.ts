import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TableColumn } from '../shared/generic-mat-table/generic-mat-table';
import { Director } from '@app/domain/director';
import { BaseList } from '../shared/BaseList';

// director-list.component.ts (extended)
@Component({
  selector: 'app-director-list',
  template: `
    <csbc-list-page-shell>
      <div filter>
        <csbc-director-filter
          [filters]="filters()"
          (filterChange)="onFilterChange($event)"
        >
        </csbc-director-filter>
      </div>

      <div actions>
        <h2>People ({{ filteredPeople().length }})</h2>
        <button mat-raised-button color="primary" (click)="navigateToNew()">
          <mat-icon>add</mat-icon>
          Add Person
        </button>
      </div>

      <div list>
        <app-generic-mat-table
          [columns]="columns"
          [data]="filteredPeople()"
          (rowClick)="navigateToDetail($event)"
        >
        </app-generic-mat-table>
      </div>
    </app-list-page-shell>

    <!-- Custom column templates -->
    <ng-template #statusTemplate let-person>
      <mat-chip [color]="person.active ? 'primary' : 'warn'">
        {{ person.active ? 'Active' : 'Inactive' }}
      </mat-chip>
    </ng-template>

    <ng-template #actionsTemplate let-person>
      <button
        mat-icon-button
        [matMenuTriggerFor]="menu"
        (click)="$event.stopPropagation()"
      >
        <mat-icon>more_vert</mat-icon>
      </button>
      <mat-menu #menu="matMenu">
        <button mat-menu-item (click)="onEdit(person)">Edit</button>
        <button mat-menu-item (click)="onDelete(person)">Delete</button>
      </mat-menu>
    </ng-template>
  `,
})
export class DirectorListComponent extends BaseList<Director> {
  override get basePath(): string {
    return '/admin-directors';
  }
  @ViewChild('statusTemplate', { read: TemplateRef, static: true })
  statusTemplate!: TemplateRef<any>;

  @ViewChild('actionsTemplate', { read: TemplateRef, static: true })
  actionsTemplate!: TemplateRef<any>;

  columns: TableColumn<Director>[] = [];

  ngOnInit() {
    // Initialize columns after templates are available
    this.columns = [
      { key: 'name', header: 'Name', field: 'name' },
      { key: 'email', header: 'Email', field: 'email' },
      { key: 'status', header: 'Status', template: this.statusTemplate },
      { key: 'actions', header: 'Actions', template: this.actionsTemplate },
    ];
  }
}
