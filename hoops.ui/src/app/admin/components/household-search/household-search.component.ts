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
    '../../../shared/scss/forms.scss',
  ],
})
export class HouseholdSearchComponent {
  #householdService = inject(HouseholdService);
  fb = inject(FormBuilder);
  searchForm = this.fb.group({
    householdName: [''],
    address: [''],
    phone: [''],
    email: [''],
  });

  onSearchClick() {
    console.log('Search Clicked');
  }
  search() {
    console.log('Search submitted');
  }
}
