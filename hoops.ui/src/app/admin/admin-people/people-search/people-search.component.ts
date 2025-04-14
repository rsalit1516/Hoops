import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { peopleSearchCriteria, PeopleService } from '@app/services/people.service';
import { debounceTime, map } from 'rxjs';

@Component({
  selector: 'csbc-people-search',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './people-search.component.html',
  styleUrls: ['./people-search.component.scss',
    '../../admin.component.scss',
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
  ],
})
export class PeopleSearchComponent {
  #peopleService = inject(PeopleService);
  pageTitle = 'Search People';
  fb = inject(FormBuilder);
  inputStyle: 'fill' | 'outline' = 'outline';
  searchForm: FormGroup;

  lastName = new FormControl('');
  firstName = new FormControl('');
  playerOnly = new FormControl('');
  selectedCriteria: peopleSearchCriteria = {
    lastName: '',
    firstName: '',
    playerOnly: false,
  };
  constructor () {
    this.searchForm = this.fb.group({
      lastName: this.lastName,
      firstName: this.firstName,
      playerOnly: this.playerOnly,
    });
    // https://localhost:5001/api/Person/search?lastName=sali&firstName=j&playerOnly=true
    this.searchForm.valueChanges.pipe(
      debounceTime(300),
      map(values => {
        this.selectedCriteria = {
          lastName: this.searchForm.value.lastName ?? '',
          firstName: this.searchForm.value.firstName ?? '',
          playerOnly: this.searchForm.value.playerOnly ?? false,
        };
        this.search();

      })
    ).subscribe();
  }

  onSearch () {
    console.log('Searching...');
  }
  hasError (controlName: string, errorName: string) {
    // return this.searchForm.controls[controlName].hasError(errorName);
  }
  newPerson () {
    console.log('New person');
  }
  search () {
    this.#peopleService.updateSelectedCriteria(this.selectedCriteria);

    // let test = this.householdService.constructQueryString(this.householdService.criteria);
    // console.log('Query String: ', test);
    this.#peopleService.executeSearch();

    // let results = this.householdService.householdSearchResults();
  }
}
