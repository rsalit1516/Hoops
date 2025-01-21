import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HouseholdService } from '@app/services/household.service';

@Component({
  selector: 'csbc-household-search',
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
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
  #householdService = inject(HouseholdService);
  fb = inject(FormBuilder);

  pageTitle = 'Household Search';

  searchForm: FormGroup;

   // Signals to support the template
   households = this.#householdService.households;
   isLoading = this.#householdService.isLoading;
   errorMessage = this.#householdService.errorMessage;
  // selectedVehicle = this.#householdService.selectedHousehold;

  constructor() {
    this.searchForm = this.fb.group({
      householdName: ['' as string],
      address: ['' as string],
      phone: ['' as string],
      email: ['' as string],
    });
  }

  search() {
    console.log('Search submitted');
    console.log(this.searchForm.value);
    this.#householdService.criteria = {
      householdName: this.searchForm.value.householdName ?? '',
      address: this.searchForm.value.address ?? '',
      phone: this.searchForm.value.phone ?? '',
      email: this.searchForm.value.email ?? '',
    };
    let test = this.#householdService.constructQueryString(this.#householdService.criteria);
    // console.log('Query String: ', test);
    this.#householdService.executeSearch();

    let results = this.#householdService.households();
    console.log('Results: ', results);
    console.log(this.#householdService.householdResource);
    console.log(this.households);
  }

  public hasError = (controlName: string, errorName: string) => {
    return '';
    // this.contentForm.controls[ controlName ].hasError(errorName);
  };
}
