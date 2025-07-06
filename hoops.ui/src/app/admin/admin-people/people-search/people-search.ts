import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { peopleSearchCriteria, PeopleService } from '@app/services/people.service';
import { FormSettings } from '@app/shared/constants';
import { debounceTime, map } from 'rxjs';

@Component({
  selector: 'csbc-people-search',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './people-search.html',
  styleUrls: ['./people-search.scss',
    '../../admin.component.scss',
    '../../../shared/scss/forms.scss',
  ],
})
export class PeopleSearch implements OnInit {
  #peopleService = inject(PeopleService);
  pageTitle = 'Search People';
  fb = inject(FormBuilder);
  // inputStyle: 'fill' | 'outline' = 'outline';
  searchForm = this.fb.group({
    lastName: [''],
    firstName: [''],
    playerOnly: [false],
  });

  selectedCriteria: peopleSearchCriteria = {
    lastName: '',
    firstName: '',
    playerOnly: false,
  };
  inputStyle = FormSettings.inputStyle;
  constructor () {

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
  ngOnInit (): void {
    // Try to get criteria from localStorage
    const stored = localStorage.getItem('peopleSearchCriteria');
    if (stored) {
      try {
        const parsed: peopleSearchCriteria = JSON.parse(stored);
        this.selectedCriteria = {
          lastName: parsed.lastName ?? '',
          firstName: parsed.firstName ?? '',
          playerOnly: parsed.playerOnly ?? false,
        };
        this.searchForm.patchValue(this.selectedCriteria, { emitEvent: false });
      } catch (e) {
        // If parsing fails, ignore and use defaults
      }
    }
    // Optionally, trigger initial search
    this.search();
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
    console.log('Search submitted');
    this.#peopleService.updateSelectedCriteria(this.selectedCriteria);
    this.#peopleService.executeSearch();
  }
}
