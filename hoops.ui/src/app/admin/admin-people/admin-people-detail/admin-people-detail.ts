import { Component } from '@angular/core';
import { PersonalInfo } from "../personal-info/personal-info";
import { HouseholdMembers } from "../household-members/household-members";
import { HouseholdSummary } from "../household-summary/household-summary";

@Component({
  selector: 'csbc-admin-people-detail',
  imports: [PersonalInfo,
    HouseholdMembers,
    HouseholdSummary],
  templateUrl: "./admin-people-detail.html",
  styleUrl: './admin-people-detail.scss'
})
export class AdminPeopleDetail {

}
