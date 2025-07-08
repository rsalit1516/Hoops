import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, OnChanges, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HouseholdService } from '@app/services/household.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Household } from '@app/domain/household';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { HouseholdMembers } from '@app/admin/admin-people/household-members/household-members';

@Component({
  selector: 'csbc-household-detail',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    RouterModule,
    HouseholdMembers

  ],
  templateUrl: './household-detail.component.html',
  styleUrls: ['./household-detail.component.scss',
    '../../admin.component.scss',
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
  ]
})
export class HouseholdDetailComponent implements OnInit, OnChanges {
  /* injected */
  #householdService = inject(HouseholdService);
  #router = inject(Router);
  fb = inject(FormBuilder);

  // householdDetailForm: FormGroup;

  pageTitle = 'Household Detail';

  householdService = inject(HouseholdService);

  household = signal<Household | null>(null);

  householdDetailForm = this.fb.group({
    householdName: ['', Validators.required],
    address1: ['', Validators.required],
    address2: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zip: ['', Validators.required],
    phone: ['', Validators.required],
    email: [''],
    comments: [''],
    // members: this.fb.array([])
  });
  constructor () {
    effect(() => {
      const record = this.#householdService.selectedRecordSignal();
      console.log(record);
      if (record !== null) {
        // this.loadRecordDetails(recordId);
        this.household.set(record);
        console.log(record);
        this.updateForm();
      }
    });

  }

  ngOnInit () {

  }
  ngOnChanges () {
    if (this.household() !== null) {
      const household = this.household();
      if (household) {
        this.householdDetailForm.patchValue({
          householdName: household.name,
          address1: household.address1,
          address2: household.address2,
          city: household.city,
          state: household.state,
          zip: household.zip,
          phone: household.phone,
          email: household.email,
          // comments: household.comments || '', // Ensure comments is set if it exists
        });
      }
    }
  }
  updateForm () {
    // this.household.set(this.#householdService.selectedHousehold);
    // const household = this.#householdService.selectedHousehold;
    // console.log('Household', household);

    // if (this.#householdService.selectedHousehold !== null) {
    //   this.household.set(this.#householdService.selectedHousehold);
    //   console.log('Household', this.household());

    const household = this.household();
    if (household) {
      this.householdDetailForm.patchValue({
        householdName: household.name,
        address1: household.address1,
        address2: household.address2,
        city: household.city,
        state: household.state,
        zip: household.zip,
        phone: household.phone,
        email: household.email,
      });
    }
    // }
  }

  removeMember (index: number) {
    // TODO: Implement removeMember
    // this.members.removeAt(index);
  }

  onSave () {
    if (this.householdDetailForm.valid) {
      let household = this.household();
      if (household) {
        const householdName = this.householdDetailForm.value.householdName;
        if (typeof householdName === 'string') {
          household.name = householdName;
        }
        const address1 = this.householdDetailForm.value.address1;
        if (typeof address1 === 'string') {
          household.address1 = address1;
        }
        const address2 = this.householdDetailForm.value.address2;
        if (typeof address2 === 'string') {
          household.address2 = address2;
        }
        const city = this.householdDetailForm.value.city;
        if (typeof city === 'string') {
          household.city = city;
        }
        const state = this.householdDetailForm.value.state;
        if (typeof state === 'string') {
          household.state = state;
        }
        const zip = this.householdDetailForm.value.zip;
        if (typeof zip === 'string') {
          household.zip = zip;
        }
        const phone = this.householdDetailForm.value.phone;
        if (typeof phone === 'string') {
          household.phone = phone;
        }
        const email = this.householdDetailForm.value.email;
        if (typeof email === 'string') {
          household.email = email;
        }
        // console.log(household);
        this.#householdService.saveHousehold(household);
        this.householdDetailForm.reset();
        this.#householdService.householdSaved.set(true);
        this.#router.navigate(['/admin/households/list']);
      }
    };
  }

}


