import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output, output, signal } from '@angular/core';
import { FormBuilder, FormsModule, FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { Household } from '@app/domain/household';
import { householdSearchCriteria, HouseholdService } from '@app/services/household.service';
import { SectionTitleComponent } from '@app/shared/components/section-title/section-title.component';
import { debounceTime, map } from 'rxjs';

@Component({
  selector: 'csbc-household-search',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    SectionTitleComponent
  ],
  templateUrl: './household-search.component.html',
  styleUrls: [
    './household-search.component.scss',
    '../../admin.component.scss',
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
  ],
})
export class HouseholdSearchComponent {
  private householdService = inject(HouseholdService);
  fb = inject(FormBuilder);
  #router = inject(Router);

  @Output() search = new EventEmitter<householdSearchCriteria>();

  pageTitle = 'Household Search';
  inputStyle: 'fill' | 'outline' = 'fill';

  searchForm: FormGroup;
  searchControl = new FormControl('');

  criteria: string = '';
  householdName = new FormControl('');
  address = new FormControl('');
  email = new FormControl('');
  phone = new FormControl('');
  searchResults = signal<any[]>([]);

  onSearch () {
    const selectedCriteria: householdSearchCriteria = {
      householdName: this.searchForm.value.householdName ?? '',
      address: this.searchForm.value.address ?? '',
      phone: this.searchForm.value.phone ?? '',
      email: this.searchForm.value.email ?? '',
    };
    console.log('Search submitted');
    console.log(selectedCriteria);
    this.search.emit(selectedCriteria);
  }

  households = output<Household[]>();
  // Signals to support the template
  // households = this.householdService.householdsResult;
  //  isLoading = this.householdService.isLoading;
  errorMessage = this.householdService.errorMessage;
  // selectedVehicle = this.#householdService.selectedHousehold;

  constructor () {
    this.searchForm = this.fb.group({
      householdName: this.householdName,
      address: this.address,
      phone: this.phone,
      email: this.email,
    });
    // Combine search values and trigger API calls when any change
    this.searchForm.valueChanges.pipe(
      debounceTime(300),
      map(values => {
        // this.householdService.fetchFilteredData({
        //   householdName: values.householdName || '',
        //   address: values.address || '',
        //   email: values.email || '',
        //   phone: values.phone || '',
        // })
        const selectedCriteria: householdSearchCriteria = {
          householdName: this.searchForm.value.householdName ?? '',
          address: this.searchForm.value.address ?? '',
          phone: this.searchForm.value.phone ?? '',
          email: this.searchForm.value.email ?? '',
        };
        this.search1();
        this.search.emit(selectedCriteria);

      })
    )
      .subscribe(results => {
        // console.log('Results: ', results);
        // this.searchResults.set(results)
        // this.householdService.householdsResult.set(results);
        // const selectedCriteria: householdSearchCriteria = {
        //   householdName: this.searchForm.value.householdName ?? '',
        //   address: this.searchForm.value.address ?? '',
        //   phone: this.searchForm.value.phone ?? '',
        //   email: this.searchForm.value.email ?? '',
        // };

        // this.search.emit(selectedCriteria);

      });

  }

  search1 () {
    console.log('Search submitted');
    console.log(this.searchForm.value);
    const selectedCriteria = {
      householdName: this.searchForm.value.householdName ?? '',
      address: this.searchForm.value.address ?? '',
      phone: this.searchForm.value.phone ?? '',
      email: this.searchForm.value.email ?? '',
    };
    this.householdService.selectedCriteria.set(selectedCriteria);

    // let test = this.householdService.constructQueryString(this.householdService.criteria);
    // console.log('Query String: ', test);
    this.householdService.executeSearch();

    let results = this.householdService.householdSearchResults();
    this.households.emit(results);
    // console.log(this.households());
  }

  clearSearch () {
    this.searchForm.reset();
  }

  newHousehold () {
    console.log('New Household');
    this.householdService.newHousehold();
    this.#router.navigate(['/admin/people/list']);

  }

  public hasError = (controlName: string, errorName: string) => {
    return '';
    // this.contentForm.controls[ controlName ].hasError(errorName);
  };
}
