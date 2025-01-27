import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HouseholdService } from '@app/services/household.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'csbc-household-detail',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule

  ],
  templateUrl: './household-detail.component.html',
  styleUrls: [ './household-detail.component.scss',
    '../../admin.component.scss',
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
  ]
})
export class HouseholdDetailComponent implements OnInit {
  /* injected */
  #householdService = inject(HouseholdService);
  householdDetailForm: FormGroup;

  pageTitle = 'Household Detail';

    constructor(private fb: FormBuilder) {
      this.householdDetailForm = this.fb.group({
        householdName: ['', Validators.required],
        address1: [ '', Validators.required ],
        address2: [ '' ],
        city: [ '', Validators.required ],
        state: [ '', Validators.required ],
        zip: [ '', Validators.required ],
        phone: [ '', Validators.required ],
        email: [ '', Validators.required ],
        // members: this.fb.array([])
      });
    }

    ngOnInit() {
      this.addMember();
  }

    get members(): FormArray {
      return (this.householdDetailForm?.get('members') as FormArray) || this.fb.array([]);
    }

    addMember() {
      this.members.push(this.fb.group({
        name: ['', Validators.required],
        relation: ['', Validators.required]
      }));
    }

    removeMember(index: number) {
      this.members.removeAt(index);
    }

    onSave() {
      if (this.householdDetailForm.valid) {
        // this.#householdService.saveHousehold(this.form.value).subscribe(response => {
        //   // handle response
        // });
      }
    }
  }


