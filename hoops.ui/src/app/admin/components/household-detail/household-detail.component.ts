import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HouseholdService } from '@app/services/household.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'csbc-household-detail',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule

  ],
  templateUrl: './household-detail.component.html',
  styleUrl: './household-detail.component.scss'
})
export class HouseholdDetailComponent implements OnInit {
  /* injected */
  #householdService = inject(HouseholdService);
    form: FormGroup;

    constructor(private fb: FormBuilder) {
      this.form = this.fb.group({
        householdName: ['', Validators.required],
        address: ['', Validators.required],
        members: this.fb.array([])
      });
    }

    ngOnInit() {
      this.addMember();
  }

    get members(): FormArray {
      return (this.form?.get('members') as FormArray) || this.fb.array([]);
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

    onSubmit() {
      if (this.form.valid) {
        // this.#householdService.saveHousehold(this.form.value).subscribe(response => {
        //   // handle response
        // });
      }
    }
  }


