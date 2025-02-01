import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { first } from 'rxjs-compat/operator/first';

@Component({
  selector: 'csbc-search-people',
  imports: [FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule
  ],
  templateUrl: './search-people.component.html',
  styleUrls: ['./search-people.component.scss',
    '../../admin.component.scss',
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
  ],
})
export class SearchPeopleComponent {
  pageTitle = 'Search People';
  fb = inject(FormBuilder);

  searchForm = this.fb.group({
    lastName: [''],
    firstName: [''],

  }); onSearch () {
    console.log('Searching...');
  }
}
