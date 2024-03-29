import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { SeasonService } from '../../services/season.service';
import { DivisionService } from '../../services/division.service';
import { Division } from '../../domain/division';
import { Season } from '../../domain/season';
import { Store, select } from '@ngrx/store';
// import { CsbcSeasonSelectComponent } from '../../shared/season-select/csbc-season-select.component';
import * as fromAdmin from '../state';
import * as adminActions from '../state/admin.actions';

import { LoadDivisions } from './../state/admin.actions';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlexModule } from '@angular/flex-layout/flex';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
    selector: 'csbc-division-list',
    templateUrl: './divisionList.component.html',
    styleUrls: ['../admin.component.scss'],
    providers: [SeasonService],
    standalone: true,
    imports: [
        MatToolbarModule,
        FlexModule,
        MatButtonModule,
        MatTableModule,
        MatIconModule,
        DatePipe,
    ],
})
export class DivisionListComponent implements OnInit, OnChanges {
  @Input() selectedSeason!: Season;
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
    'actions',
    'viewActions',
  ];
  dataSource: MatTableDataSource<Division> | undefined;
  divisions$: Observable<Division[]> | undefined;
  constructor(
    private _divisionService: DivisionService,
    public seasonService: SeasonService,
    private store: Store<fromAdmin.State>,
    private router: Router
  ) {}

  ngOnInit() {
    this.store.pipe(select(fromAdmin.getSelectedSeason)).subscribe((season) => {
      this.seasonId = season.seasonId;
      console.log(this.seasonId);
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
    this.selectedDivision = division;
  }
  setDivisionData(data: any[]): Division[] {
    let divisions: Division[] = [];
    console.log(data);
    for (let i = 0; i <= data.length; i++) {
      console.log(data[i]);
      if (data[i] !== undefined) {
        let division: Division = {
          seasonId: data[i].seasonId,
          divisionId: data[i].divisionId,
          divisionDescription: data[i].divisionDescription,
          minDate: data[i].minDate,
          maxDate: data[i].maxDate,
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
    console.log(division);
  }
}
