import {
  Component,
  OnInit,
  OnChanges,
  Input,
  input,
  inject,
  Signal,
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
import { SeasonSelectComponent } from '@app/admin/admin-shared/season-select/season-select.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'csbc-division-list',
    templateUrl: './divisionList.component.html',
    styleUrls: ['../../admin.component.scss'],
    providers: [SeasonService, DivisionService],
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
        SeasonSelectComponent
    ]
})

export class DivisionListComponent implements OnInit, OnChanges {
  selectedSeason = input<Season>();
  private divisionService = inject(DivisionService);
  private seasonService = inject(SeasonService);
  private store = inject(Store<fromAdmin.State>);
  private router = inject(Router);

    // Signals
    // users = this.userService.members;
    isLoading = this.divisionService.isLoading;
    currentDivision = this.divisionService.currentDivision;
    //todosForMember = this.divisionService.filteredToDos;
    errorMessage = this.divisionService.error;
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
  // divisions: Division[] | undefined;
  // subscription: Subscription;
  error: string | undefined;
  selectedDivision: Division | undefined;
  seasonId: number | undefined;
  displayedColumns = [
    'divisionId',
    'divisionDescription',
    'minDate',
    'maxDate',
    // 'view',
    'teams',
  ];
  dataSource!: MatTableDataSource<Division>;
  divisions$: Observable<Division[]> | undefined;

  constructor() { }

  ngOnInit() {
    console.log(this.divisionService.divisions());
    this.store.pipe(select(fromAdmin.getSelectedSeason)).subscribe((season) => {
      this.seasonId = season.seasonId;
      this.divisionService.seasonId = this.seasonId!;
      // console.log(this.divisions());
      // this.dataSource = new MatTableDataSource(this._divisionService.divisions());
      this.store.select(fromAdmin.getSeasonDivisions).subscribe((divisions) => {
         // this.divisions = toSignal(divisions);
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
    let division = new Division();
    this.divisionService.setCurrentDivision(division.divisionId);
    this.store.dispatch(new adminActions.SetSelectedDivision(division));
    this.router.navigate(['./admin/division/edit']);
  }
  viewTeams(division: any) {
    console.log(division);
    this.store.dispatch(new adminActions.SetSelectedDivision(division));
    this.router.navigate(['./admin/season-setup']);
  }
  getRecord(division: any) {
    this.divisionService.setCurrentDivision(division);
    this.store.dispatch(new adminActions.SetSelectedDivision(division));
    this.router.navigate(['./admin/division/edit']);
  }
}

  // This should be somewhere reusable
  export function setErrorMessage(err: HttpErrorResponse): string {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error(err);
    return errorMessage;
  }
