import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { Director } from '@app/domain/director';
import { Person } from '@app/domain/person';
import { DirectorService } from '@app/services/director.service';
import { Observable } from 'rxjs';
import { BaseDetail } from '../shared/BaseDetail';

@Component({
  selector: 'csbc-director-detail',
  imports: [MatCardModule, MatButtonModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>
          {{ mode() === 'create' ? 'New Person' : 'Edit Person' }}
        </mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <app-person-form
          [person]="person()"
          (save)="onSave($event)"
          (cancel)="onCancel()"
        >
        </app-person-form>
      </mat-card-content>
    </mat-card>
  `,
})
export class AdminDirectorDetail extends BaseDetail<Director> {
  private directorService = inject(DirectorService);

  protected override getBasePath(): string {
    return '/admin/admin-directors';
  }

  protected override saveItem(item: Director): Observable<Director> {
    return item.id
      ? this.directorService.update(item)
      : this.directorService.create(item);
  }

  protected override createNew(): Director {
    return {
      id: 0,
      companyId: 0,
      peopleId: 0,
      seq: 0,
      title: '',
      name: '',
      createdDate: new Date(),
      createdUser: '',
    };
  }
}
