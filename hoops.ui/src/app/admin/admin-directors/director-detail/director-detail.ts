import { Component, computed, inject } from '@angular/core';
import { BaseDetail } from '@app/admin/shared/BaseDetail';
import { Director } from '@app/domain/director';
import { DirectorService } from '@app/services/director.service';
import { MatCardModule } from '@angular/material/card';
import { DirectorForm } from '../director-form/director-form';
import { Observable } from 'rxjs';

@Component({
  selector: 'csbc-director-detail',
  imports: [MatCardModule, DirectorForm],
  templateUrl: './director-detail.html',
  styleUrl: './director-detail.scss',
})
export class DirectorDetail extends BaseDetail<Director> {
  private directorService = inject(DirectorService);

  // Computed signal to get the current director or create a new one
  director = computed(() => {
    const item = this.item();
    return item || this.createNew();
  });

  protected override getBasePath(): string {
    return '/admin/director';
  }

  protected override saveItem(item: Director): Observable<Director> {
    return item.id
      ? this.directorService.update(item)
      : this.directorService.create(item);
  }

  protected override createNew(): Director {
    return {
      name: '',
      companyId: 1,
      id: 0,
      peopleId: 0,
      seq: 0,
      title: '',
      createdDate: new Date(),
      createdUser: '',
    };
  }
}
