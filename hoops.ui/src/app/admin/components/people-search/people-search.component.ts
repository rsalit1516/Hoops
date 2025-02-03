import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { first } from 'rxjs-compat/operator/first';

@Component({
  selector: 'csbc-people-search',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule
  ],
  templateUrl: './people-search.component.html',
  styleUrls: ['./people-search.component.scss',
    '../../admin.component.scss',
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
  ],
})
export class PeopleSearchComponent {
  pageTitle = 'Search People';
  fb = inject(FormBuilder);
  inputStyle: 'fill' | 'outline' = 'outline';

  searchForm = this.fb.group({
    lastName: [''],
    firstName: [ '' ],
    playerOnly: [ false ],

  });
  constructor() {
    // https://localhost:5001/api/Person/search?lastName=sali&firstName=j&playerOnly=true
  }

  onSearch() {
    console.log('Searching...');
  }
  hasError(controlName: string, errorName: string) {
    // return this.searchForm.controls[controlName].hasError(errorName);
  }
}
