import { Component } from '@angular/core';
import { PersonalInfoComponent } from "../personal-info/personal-info.component";
import { HouseholdMembers } from "../household-members/household-members";
import { HouseholdSummaryComponent } from "../household-summary/household-summary.component";

@Component({
  selector: 'csbc-admin-people-detail',
  imports: [PersonalInfoComponent,
    HouseholdMembers,
    HouseholdSummaryComponent],
  templateUrl: './admin-people-detail.component.html',
  styleUrl: './admin-people-detail.component.scss'
})
export class AdminPeopleDetailComponent {

}
