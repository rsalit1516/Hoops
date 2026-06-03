import { Component, input, WritableSignal } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Constants } from '@app/shared/constants';

export interface DivisionTemplate {
  name: string;
  gender1: string;
  minYears1: number;
  maxYears1: number;
  maxMonth1: number;
  maxDay1: number;
  gender2: string | null;
  minYears2: number | null;
  maxYears2: number | null;
  maxMonth2: number | null;
  maxDay2: number | null;
}

export interface SetupRow {
  template: DivisionTemplate;
  selected: WritableSignal<boolean>;
  teamCount: WritableSignal<number>;
}

export const DIVISION_TEMPLATES: DivisionTemplate[] = [
  {
    name: Constants.SETUP_TR2COED,
    gender1: 'M', minYears1: 9, maxYears1: 6, maxMonth1: 3, maxDay1: 31,
    gender2: 'F', minYears2: 9, maxYears2: 6, maxMonth2: 3, maxDay2: 31,
  },
  {
    name: Constants.SETUP_TR4,
    gender1: 'M', minYears1: 11, maxYears1: 9, maxMonth1: 8, maxDay1: 31,
    gender2: null, minYears2: null, maxYears2: null, maxMonth2: null, maxDay2: null,
  },
  {
    name: Constants.SETUP_INTBOYS,
    gender1: 'M', minYears1: 13, maxYears1: 11, maxMonth1: 8, maxDay1: 31,
    gender2: 'M', minYears2: null, maxYears2: null, maxMonth2: null, maxDay2: null,
  },
  {
    name: Constants.SETUP_JVBOYS,
    gender1: 'M', minYears1: 15, maxYears1: 13, maxMonth1: 8, maxDay1: 31,
    gender2: 'M', minYears2: null, maxYears2: null, maxMonth2: null, maxDay2: null,
  },
  {
    name: Constants.SETUP_HSBOYS,
    gender1: 'M', minYears1: 19, maxYears1: 15, maxMonth1: 8, maxDay1: 31,
    gender2: 'F', minYears2: null, maxYears2: null, maxMonth2: null, maxDay2: null,
  },
  {
    name: Constants.SETUP_INTGIRLS,
    gender1: 'F', minYears1: 13, maxYears1: 9, maxMonth1: 8, maxDay1: 31,
    gender2: null, minYears2: null, maxYears2: null, maxMonth2: null, maxDay2: null,
  },
  {
    name: Constants.SETUP_JVGIRLS,
    gender1: 'F', minYears1: 15, maxYears1: 13, maxMonth1: 8, maxDay1: 31,
    gender2: 'F', minYears2: null, maxYears2: null, maxMonth2: null, maxDay2: null,
  },
  {
    name: Constants.SETUP_HSGIRLS,
    gender1: 'F', minYears1: 19, maxYears1: 15, maxMonth1: 8, maxDay1: 31,
    gender2: 'F', minYears2: null, maxYears2: null, maxMonth2: null, maxDay2: null,
  },
  {
    name: Constants.SETUP_MEN,
    gender1: 'M', minYears1: 46, maxYears1: 19, maxMonth1: 8, maxDay1: 31,
    gender2: 'F', minYears2: null, maxYears2: null, maxMonth2: null, maxDay2: null,
  },
  {
    name: Constants.SETUP_WOMEN,
    gender1: 'F', minYears1: 46, maxYears1: 19, maxMonth1: 8, maxDay1: 31,
    gender2: null, minYears2: null, maxYears2: null, maxMonth2: null, maxDay2: null,
  },
];

@Component({
  selector: 'division-template-setup',
  templateUrl: './division-template-setup.html',
  styleUrls: ['./division-template-setup.scss'],
  imports: [MatCheckboxModule, MatFormFieldModule, MatInputModule],
})
export class DivisionTemplateSetup {
  readonly rows = input.required<SetupRow[]>();

  setTeamCount(row: SetupRow, value: string): void {
    const n = parseInt(value, 10);
    row.teamCount.set(isNaN(n) || n < 1 ? 1 : n);
  }
}
