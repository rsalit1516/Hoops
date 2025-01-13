import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'csbc-household-detail',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './household-detail.component.html',
  styleUrl: './household-detail.component.scss'
})
export class HouseholdDetailComponent {

}
