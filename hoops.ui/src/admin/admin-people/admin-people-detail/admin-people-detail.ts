import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PersonalInfo } from '../personal-info/personal-info';
import { HouseholdMembers } from '../household-members/household-members';
import { RegistrationHouseholdForm } from '@app/admin/admin-player/player-registration/registration-household-form/registration-household-form';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'csbc-admin-people-detail',
  imports: [PersonalInfo, HouseholdMembers, RegistrationHouseholdForm],
  templateUrl: './admin-people-detail.html',
  styleUrls: ['./admin-people-detail.scss', './../../admin.scss'],
})
export class AdminPeopleDetail {}
