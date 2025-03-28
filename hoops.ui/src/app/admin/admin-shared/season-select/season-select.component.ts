import { Component, inject, OnInit, computed, OnChanges } from '@angular/core';

import { Season } from '@app/domain/season';
import { UntypedFormControl, FormsModule } from '@angular/forms';
import { AdminSeasonService } from '../services/season.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SeasonService } from '@app/services/season.service';

@Component({
  selector: 'season-select',
  template: `<mat-form-field>
  <mat-label>{{title}}</mat-label>
  <mat-select
    [value]="selectedSeason"
    (selectionChange)="onChange($event.value)"
    class="form-control"
  >
    @for( season of seasonService.seasons; track season) {
    <mat-option [value]="season.seasonId" (click)="changeSeason(season)">
      {{ season.description }}
    </mat-option>
    }
  </mat-select>
</mat-form-field>
`,
  styleUrls: ['./../../../shared/scss/select.scss',
    './../../../shared/scss/forms.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    AsyncPipe,
  ]
})
export class SeasonSelectComponent implements OnInit {
  #AdminSeasonService = inject(AdminSeasonService);
  readonly seasonService = inject(SeasonService);
  selected: Season | undefined;
  seasonComponent: UntypedFormControl | null | undefined;
  defaultSeason: Season | undefined;
  seasons = this.seasonService.seasons;
  selectedSeason = computed(() => this.seasonService.selectedSeason);
  title = 'Select Season';

  constructor () { }

  ngOnInit () {
  }
  changeSeason (season: Season) {
    console.log('Season from changeSeason = ', season);
    this.seasonService.selectSeason(season);
  }
  onChange (season: Season) {
    this.seasonService.selectSeason(season);
  }
}
