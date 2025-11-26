
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
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { HouseholdMembers } from '@app/admin/admin-people/household-members/household-members';
import { LoggerService } from '@app/services/logger.service';

@Component({
  selector: 'csbc-household-detail',
  imports: [
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
  templateUrl: "./household-detail.html",
  styleUrls: ['./household-detail.scss',
    '../../admin.scss',
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
  ]
})
export class HouseholdDetail implements OnInit, OnChanges {
  /* injected */
  #householdService = inject(HouseholdService);
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #logger = inject(LoggerService);
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
      this.#logger.debug('Selected record:', record);
      if (record !== null) {
        // this.loadRecordDetails(recordId);
        this.household.set(record);
        this.#logger.debug('Household set:', record);
        this.updateForm();
      }
    });

  }

  ngOnInit () {
    // Check if this is a new household
    const url = this.#route.snapshot.url;
    if (url.length > 0 && url[0].path === 'new') {
      this.#householdService.newHousehold();
    }
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
        this.#logger.info('Saving household:', household);

        this.#householdService.saveHousehold(household).subscribe({
          next: (response) => {
            this.#logger.info('Household saved successfully:', response);
            this.householdDetailForm.reset();
            this.#householdService.householdSaved.set(true);
            this.#router.navigate(['/admin/households/list']);
          },
          error: (error) => {
            this.#logger.error('Error saving household:', error);
            // You might want to show a user-friendly error message here
            alert('Error saving household. Please check the console for details.');
          }
        });
      }
    };
  }

}


