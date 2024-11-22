import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Division } from '@app/domain/division';
import { DivisionService } from '@app/services/division.service';

@Component({
  selector: 'csbc-new-division-selector',
  templateUrl: './new-division-selector.component.html',
  imports: [CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatOptionModule,
    MatButtonModule],
  styleUrls: ['../../admin.component.scss',
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
    './new-division-selector.component.scss'],
  providers: [DivisionService]
})
export class NewDivisionSelectorComponent {
  divisionService = inject(DivisionService);
  selectedDivision: Division | undefined;
  hideNameInput = signal<boolean>(true);
  title = 'New Division';

  divisionSelected ($event: any) {
    this.divisionService.createTemporaryDivision($event.value);
    this.hideNameInput.set($event.value !== 'other');
  }

  addDivision () {
  }
  cancel () {
  }
}
