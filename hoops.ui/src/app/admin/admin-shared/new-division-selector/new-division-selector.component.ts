import { Component } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { Division } from '@app/domain/division';

@Component({
  selector: 'app-new-division-selector',
  standalone: true,
  imports: [ MatFormField,
    MatSelect,
    MatInputModule,
    MatOptionModule
  ],
  templateUrl: './new-division-selector.component.html',
  styleUrl: './new-division-selector.component.scss'
})
export class NewDivisionSelectorComponent {
  selectedDivision: Division | undefined;

  divisionSelected($event: any) {
  }
}
