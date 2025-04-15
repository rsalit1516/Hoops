import { Component } from '@angular/core';
import { PersonalInfoComponent } from "../personal-info/personal-info.component";
import { HouseholdMembersComponent } from "../household-members/household-members.component";
import { HouseholdSummaryComponent } from "../household-summary/household-summary.component";

@Component({
  selector: 'csbc-admin-people-detail',
  imports: [PersonalInfoComponent, HouseholdMembersComponent, HouseholdSummaryComponent],
  templateUrl: './admin-people-detail.component.html',
  styleUrl: './admin-people-detail.component.scss'
})
export class AdminPeopleDetailComponent {

}
