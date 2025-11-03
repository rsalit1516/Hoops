import { Component, inject } from '@angular/core';
import { BaseDetail } from '@app/admin/shared/BaseDetail';
import { Director } from '@app/domain/director';
import { DirectorService } from '@app/services/director.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'csbc-director-form',
  imports: [],
  templateUrl: './director-detail.html',
  styleUrl: './director-detail.scss',
})
export class DirectorDetail extends BaseDetail<Director> {
  private personService = inject(DirectorService);

  protected override getBasePath(): string {
    return '/admin/director';
  }

  protected override saveItem(item: Director): Observable<Director> {
    return item.id
      ? this.personService.update(item)
      : this.personService.create(item);
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
