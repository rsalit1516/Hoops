import { Component, computed, effect, inject } from '@angular/core';
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
  styleUrls: [
    './director-detail.scss',
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
  ],
})
export class DirectorDetail extends BaseDetail<Director> {
  private directorService = inject(DirectorService);

  // Computed signal to get the current director or create a new one
  director = computed(() => {
    const item = this.item();
    return item || this.createNew();
  });

  constructor() {
    super();

    // Effect to load director when the service signal updates
    effect(() => {
      const directors = this.directorService.directorsSignal();
      const id = this.route.snapshot.paramMap.get('id');

      // Only load if we're in edit mode, have an ID, have directors, and don't already have an item
      if (this.mode() === 'edit' && id && directors && !this.item()) {
        const directorId = +id;
        const director = directors.find(d => d.directorId === directorId);
        if (director) {
          this.item.set(director);
        }
      }
    });
  }

  override ngOnInit() {
    // Call parent ngOnInit to handle mode
    super.ngOnInit();
  }

  protected override getBasePath(): string {
    return '/admin/director';
  }

  protected override saveItem(item: Director): Observable<Director> {
    return item.directorId
      ? this.directorService.update(item)
      : this.directorService.create(item);
  }

  protected override createNew(): Director {
    return {
      name: '',
      companyId: 1,
      directorId: 0,
      peopleId: 0,
      seq: 0,
      title: '',
      createdDate: new Date(),
      createdUser: '',
    };
  }
}
