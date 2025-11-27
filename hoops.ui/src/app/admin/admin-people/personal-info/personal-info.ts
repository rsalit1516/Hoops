
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
import { LoggerService } from '@app/services/logger.service';

interface Item {
  id: number;
  name: string;
}

@Component({
  selector: 'csbc-personal-info',
  imports: [
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
  templateUrl: "./personal-info.html",
  styleUrls: ['./personal-info.scss',
    '../../admin.scss',
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
  ],
  providers: [
    provideNativeDateAdapter(),
  ],
})
export class PersonalInfo implements OnInit {
  fb = inject(FormBuilder);
  readonly router = inject(Router);
  readonly #peopleService = inject(PeopleService);
  private logger = inject(LoggerService);
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
      currentBM: [false],
      playsUp: [false],
      volunteerCheckboxes: this.fb.array([]),
      comments: [''],
    });

    this.addVolunteerCheckboxes(); // Initialize volunteer checkboxes

  }
  patchValue () {
    const person = this.person();

    this.personalInfoForm.patchValue({
      firstName: person?.firstName ?? '',
      lastName: person?.lastName ?? '',
      birthDate: person?.birthDate ?? '',
      birthCertificate: person?.bc ?? false,
      gender: person?.gender ?? 'male',
      cellPhone: person?.cellphone ?? '',
      workPhone: person?.workphone ?? '',
      grade: person?.grade ?? 0,
      schoolName: person?.schoolName ?? '',
      parent: person?.parent ?? false,
      coach: person?.coach ?? false,
      player: person?.player ?? false,
      currentBM: person?.boardMember ?? false,
      playsUp: person?.giftedLevelsUp ?? 0,
      comments: person?.comments ?? '',
    });

    // Patch volunteer checkboxes
    if (person) {
      const checkboxesArray = this.personalInfoForm.get('volunteerCheckboxes') as FormArray;
      checkboxesArray.setValue([
        person.boardOfficer || false,
        person.boardMember || false,
        person.ad || false,
        person.sponsor || false,
        person.signUps || false,
        person.tryOuts || false,
        person.teeShirts || false,
        person.printing || false,
        person.equipment || false,
        person.electrician || false,
        person.asstCoach || false,
      ]);
    }
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
    this.logger.info('Submitting personal info form:', this.personalInfoForm.value);

    const currentPerson = this.person();
    if (!currentPerson) {
      this.logger.error('No person selected');
      return;
    }

    // Map form values to person object
    const updatedPerson = {
      ...currentPerson,
      firstName: this.personalInfoForm.value.firstName,
      lastName: this.personalInfoForm.value.lastName,
      birthDate: this.personalInfoForm.value.birthDate,
      bc: this.personalInfoForm.value.birthCertificate,
      cellphone: this.personalInfoForm.value.cellPhone,
      workphone: this.personalInfoForm.value.workPhone,
      gender: this.personalInfoForm.value.gender,
      grade: this.personalInfoForm.value.grade,
      schoolName: this.personalInfoForm.value.schoolName,
      parent: this.personalInfoForm.value.parent,
      coach: this.personalInfoForm.value.coach,
      player: this.personalInfoForm.value.player,
      boardMember: this.personalInfoForm.value.currentBM,
      giftedLevelsUp: this.personalInfoForm.value.playsUp ? 1 : 0,
      comments: this.personalInfoForm.value.comments,
    };

    // Map volunteer checkboxes to person properties
    const volunteerCheckboxes = this.personalInfoForm.value.volunteerCheckboxes;
    if (volunteerCheckboxes) {
      updatedPerson.boardOfficer = volunteerCheckboxes[0] || false;
      updatedPerson.boardMember = volunteerCheckboxes[1] || false;
      updatedPerson.ad = volunteerCheckboxes[2] || false;
      updatedPerson.sponsor = volunteerCheckboxes[3] || false;
      updatedPerson.signUps = volunteerCheckboxes[4] || false;
      updatedPerson.tryOuts = volunteerCheckboxes[5] || false;
      updatedPerson.teeShirts = volunteerCheckboxes[6] || false;
      updatedPerson.printing = volunteerCheckboxes[7] || false;
      updatedPerson.equipment = volunteerCheckboxes[8] || false;
      updatedPerson.electrician = volunteerCheckboxes[9] || false;
      updatedPerson.asstCoach = volunteerCheckboxes[10] || false;
    }

    this.logger.info('Saving person:', updatedPerson);

    // Call the backend to save
    this.#peopleService.savePerson(updatedPerson).subscribe({
      next: (response) => {
        this.logger.info('Person saved successfully:', response);
        this.#peopleService.updateSelectedPerson(response);
        this.personalInfoForm.markAsPristine();
      },
      error: (error) => {
        this.logger.error('Error saving person:', error);
      }
    });
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
