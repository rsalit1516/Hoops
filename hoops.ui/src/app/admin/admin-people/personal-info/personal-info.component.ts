import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { PeopleService } from '@app/services/people.service';
import { FormSettings } from '@app/shared/constants';

interface Item {
  id: number;
  name: string;
}

@Component({
  selector: 'csbc-personal-info',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatRadioModule,
    RouterModule
  ],
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss',
    '../../admin.component.scss',
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
  ],
  providers: [
    provideNativeDateAdapter(),
  ],
})
export class PersonalInfoComponent implements OnInit {
  fb = inject(FormBuilder);
  readonly router = inject(Router);
  readonly #peopleService = inject(PeopleService);
  pageTitle = 'Personal Information';
  inputStyle = FormSettings.inputStyle;
  volunteers = [
    { id: 1, name: 'Board Officer' },
    { id: 2, name: 'Board Member' },
    { id: 3, name: 'Athletic Director' },
    { id: 4, name: 'Sponsor' },
    { id: 5, name: 'Sign Ups' },
    { id: 6, name: 'Try Outs' },
    { id: 7, name: 'Tee Shirts' },
    { id: 8, name: 'Printing Co.' },
    { id: 9, name: 'Equipment' },
    { id: 10, name: 'Electrician' },
    { id: 11, name: 'Asst Coach' },
  ];
  person = this.#peopleService.selectedPerson;
  personalInfoForm!: FormGroup;

  get volunteerControls (): FormArray {
    return this.personalInfoForm.get('volunteerControls') as FormArray;
  }

  constructor () {
    effect(() => {
      this.person = this.#peopleService.selectedPerson;
      this.patchValue();

    });
  }

  ngOnInit (): void {
    this.personalInfoForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      birthDate: [''],
      birthCertificate: [false],
      cellPhone: [''],
      workPhone: [''],
      gender: [''],
      grade: [''],
      schoolName: [''],
      parent: [false],
      coach: [false],
      player: [false],
      volunteerCheckboxes: this.fb.array([]),
      Comments: [''],
    });

    this.addVolunteerCheckboxes(); // Initialize volunteer checkboxes

  }
  patchValue () {
    this.personalInfoForm.patchValue({
      firstName: this.person()?.firstName ?? '',
      lastName: this.person()?.lastName ?? '',
      birthDate: this.person()?.birthDate ?? '',
      birthCertificate: this.person()?.bc ?? false,
      gender: this.person()?.gender ?? 'male',
      cellPhone: this.person()?.cellphone ?? '',
      workPhone: this.person()?.workphone ?? '',
      grade: this.person()?.grade ?? 0,
      schoolName: this.person()?.schoolName ?? '',

      comments: this.person()?.comments ?? '',
    });
  }

  addVolunteerCheckboxes () {
    const checkboxesArray = this.personalInfoForm.get('volunteerCheckboxes') as FormArray;
    this.volunteers.forEach(() => checkboxesArray.push(this.fb.control(false)));
  }

  //   // Clear the FormArray to avoid duplicates if this method is called multiple times
  //   this.volunteerControls.clear();

  //   // Add a FormControl for each volunteer
  //   this.volunteers.forEach(() => {
  //     const control = new FormControl(false);  //(this.fb.control(false); // Initialize each checkbox as unchecked
  //     this.volunteerControls.push(control); // Add the control to the FormArray
  //   });
  // }
  onSubmit () {
    console.log(this.personalInfoForm.value);
    const selectedValues = this.personalInfoForm.value.checkboxes
      .map((checked: boolean, index: number) =>
        checked ? this.volunteers[index].name : null
      )
      .filter((value: string | null) => value !== null);

    console.log('Selected Values:', selectedValues);
  }

  onReset () {
    this.personalInfoForm.reset();
  }

}

// ad:false
// asstCoach:false
// bc:false
// birthDate:"1988-12-15T00:00:00"
// boardMember:false
// boardOfficer:false
// cellphone:null
// coach:false
// companyId:1
// createdDate:null
// createdUser:null
// electrician:false
// email:"miduma@bellsouth.net"
// equipment:false
// feeWaived:false
// firstName:"DUSTY"
// gender:"M"
// giftedLevelsUp:0
// grade:13
// houseId:7817
// household:null
// lastName:"SAATHOFF"
// latestRating:null
// latestSeason:null
// latestShirtSize:"N/A"
// parent:false
// personId:7817
// player:true
// printing:false
// schoolName:null
// signUps:false
// sponsor:false
// suspended:false
// teeShirts:false
// tempId:7817
// tryOuts:false
// workphone:"954-752-4796;592-583"
