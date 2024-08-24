import {
  Component,
  OnInit,
  OnChanges,
  Input,
  input,
  inject,
} from '@angular/core';

import { SeasonService } from '../../../services/season.service';
import { DivisionService } from '../../../services/division.service';
import { Division } from '../../../domain/division';
import { Season } from '../../../domain/season';
import { Store, select } from '@ngrx/store';
// import { CsbcSeasonSelectComponent } from '../../shared/season-select/csbc-season-select.component';
import * as fromAdmin from '../../state';
import * as adminActions from '../../state/admin.actions';

import { LoadDivisions } from '../../state/admin.actions';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'csbc-division-list',
  templateUrl: './divisionList.component.html',
  styleUrls: ['../../admin.component.scss'],
  providers: [SeasonService, DivisionService],
  standalone: true,
  imports: [
    MatToolbarModule,
    FlexModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    DatePipe,
  ],
})

export class DivisionListComponent implements OnInit, OnChanges {
  selectedSeason = input<Season>();
  private _divisionService = inject(DivisionService);
  private seasonService = inject(SeasonService);
  private store = inject(Store<fromAdmin.State>);
  private router = inject(Router);

  //  set selectedSeason(value: Season) {
  //     console.log(value);
  //     if (value !== undefined) {
  //         //this.seasonService.selectedSeason$.subscribe(season =>
  //         this._divisionService.getSeasonDivisions(value).subscribe(
  //             (divisions) => this.divisions = divisions
  //         );
  //     }
  //  }
  // @Input() selectedSeason: Season;
  divisions: Division[] | undefined;
  // subscription: Subscription;
  errorMessage: string | undefined;
  selectedDivision: Division | undefined;
  seasonId: number | undefined;
  displayedColumns = [
    'divisionId',
    'divisionDescription',
    'minDate',
    'maxDate',
    'view',
    'teams',
  ];
  dataSource!: MatTableDataSource<Division>;
  divisions$: Observable<Division[]> | undefined;

  constructor() {}

  ngOnInit() {
    this.store.pipe(select(fromAdmin.getSelectedSeason)).subscribe((season) => {
      this.seasonId = season.seasonId;
      this.store.select(fromAdmin.getSeasonDivisions).subscribe((divisions) => {
        this.divisions = divisions;
        this.dataSource = new MatTableDataSource(divisions);

        //turn this to effect or load into store
        //this.store.dispatch(new adminActions.)
      });
    });
  }

  ngOnChanges(): void {
    if (this.selectedSeason !== undefined) {
      // this._divisionService.getSeasonDivisions(this.selectedSeason).subscribe(
      //    (divisions) => this.divisions = divisions);
      // this.seasonService.selectedSeason$.subscribe(
    }
  }

  onSelectedSeason() {
    // this.selectedSeason = season;
    console.log('Help');
    //    this.seasonService.selectedSeason$.subscribe(

    //          () => console.log('Help'));
  }
  onSelect(division: Division): void {
    // this._divisionService.setCurrentDivision(division);
  }
  setDivisionData(data: any[]): Division[] {
    let divisions: Division[] = [];
    console.log(data);
    for (let i = 0; i <= data.length; i++) {
      console.log(data[i]);
      if (data[i] !== undefined) {
        let division: Division = {
          companyId: 1,
          seasonId: data[ i ].seasonId,
          divisionId: data[ i ].divisionId,
          divisionDescription: data[ i ].divisionDescription,
          minDate: data[ i ].minDate,
          maxDate: data[ i ].maxDate,
          gender: data[ i ].gender,
          minDate2: data[ i ].minDate2,
          maxDate2: data[ i ].maxDate2,
          gender2: data[ i ].gender2
        };
        divisions.push(division);
      }
      console.log(divisions);
    }
    return divisions;
  }
  addDivision() {
    console.log('Add Division');
  }
  viewTeams(division: any) {
    console.log(division);
    this.store.dispatch(new adminActions.SetSelectedDivision(division));
    this.router.navigate(['./admin/season-setup']);
  }
  getRecord(division: any) {
    this._divisionService.setCurrentDivision(division);
    this.store.dispatch(new adminActions.SetSelectedDivision(division));
    this.router.navigate(['./admin/division-detail']);
  }
}
