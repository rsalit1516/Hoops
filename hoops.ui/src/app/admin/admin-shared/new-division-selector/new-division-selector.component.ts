import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { Division } from '@app/domain/division';
import { DivisionService } from '@app/services/division.service';

@Component({
  selector: 'csbc-new-division-selector',
  standalone: true,
  imports: [ MatFormField,
    MatSelect,
    MatInputModule,
    MatOptionModule,
  MatButtonModule],
  templateUrl: './new-division-selector.component.html',
  styleUrls: [ '../../admin.component.scss',
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
    './new-division-selector.component.scss']
})
export class NewDivisionSelectorComponent {
  divisionService = inject(DivisionService);
  selectedDivision: Division | undefined;
  hideNameInput = signal<boolean>(true);

  divisionSelected($event: any) {
    this.divisionService.createTemporaryDivision($event.value);
    this.hideNameInput.set( $event.value !== 'other');
  }

  addDivision() {
  }
  cancel() {
  }
}
