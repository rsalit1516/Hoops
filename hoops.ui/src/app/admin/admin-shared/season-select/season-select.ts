import { Component, inject, OnInit, computed, OnChanges, effect } from '@angular/core';

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
    [(value)]="season"
    class="form-control"
  >
    @for( season of seasonService.seasons; track season) {
    <mat-option [value]="season" (click)="changeSeason(season)">
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
  ]
})
export class SeasonSelect implements OnInit {
  readonly seasonService = inject(SeasonService);
  title = 'Select Season';
  // seasonComponent: UntypedFormControl | null | undefined;
  defaultSeason: Season | undefined;
  seasons = this.seasonService.seasons;
  selectedSeason = computed(() => this.seasonService.selectedSeason);
  season = this.selectedSeason();

  constructor () {
    effect(() => {
      console.log(this.seasonService.selectedSeason);
      this.season = this.selectedSeason();
    });
  }

  ngOnInit () {
  }
  changeSeason (season: Season) {
    console.log('Season from changeSeason = ', season);
    this.seasonService.updateSelectedSeason(season);
  }

  // onChange (season: Season) {
  //   this.seasonService.selectSeason(season);
  // }
}
