import {
  Component,
  OnInit,
  OnChanges,
  input,
  inject,
  computed,
  effect,
} from '@angular/core';

import { SeasonService } from '../../../services/season.service';
import { DivisionService } from '@app/services/division.service';
import { Division } from '../../../domain/division';
import { Season } from '../../../domain/season';
import { Store } from '@ngrx/store';
import * as fromAdmin from '../../state';

import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpErrorResponse } from '@angular/common/http';
import { DivisionToolbar } from '../../components/division-toolbar/division-toolbar';

@Component({
  selector: 'csbc-division-list',
  templateUrl: './divisionList.html',
  styleUrls: ['../../admin.scss'],
  // providers: [SeasonService, DivisionService],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    DatePipe,
    DivisionToolbar,
  ],
})
export class DivisionList implements OnInit, OnChanges {
  selectedSeason = input<Season>();
  readonly divisionService = inject(DivisionService);
  #seasonService = inject(SeasonService);
  private store = inject(Store<fromAdmin.State>);
  #router = inject(Router);

  // Signals
  // users = this.userService.members;
  isLoading = this.divisionService.isLoading;
  // currentDivision = this.divisionService.currentDivision;
  // todosForMember = this.divisionService.filteredToDos;
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
  divisions = computed(() => this.divisionService.seasonDivisions()); // This will be a signal

  displayedColumns = [
    'divisionId',
    'divisionDescription',
    'minDate',
    'maxDate',
    // 'view',
    'teams',
  ];
  dataSource: MatTableDataSource<Division> = new MatTableDataSource<Division>(
    this.divisionService.seasonDivisions()
  );
  divisions$: Observable<Division[]> | undefined;

  constructor() {
    effect(() => {
      this.dataSource = new MatTableDataSource<Division>(
        this.divisionService.seasonDivisions()
      );
    });
  }

  ngOnInit() {}

  ngOnChanges(): void {
    // if (this.selectedSeason !== undefined) {
    // this._divisionService.getSeasonDivisions(this.selectedSeason).subscribe(
    //    (divisions) => this.divisions = divisions);
    // this.seasonService.selectedSeason$.subscribe(
    // }
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
          seasonId: data[i].seasonId,
          divisionId: data[i].divisionId,
          divisionDescription: data[i].divisionDescription,
          minDate: data[i].minDate,
          maxDate: data[i].maxDate,
          gender: data[i].gender,
          minDate2: data[i].minDate2,
          maxDate2: data[i].maxDate2,
          gender2: data[i].gender2,
          directorId: data[i].directorId,
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

    // this.#divisionService.setCurrentDivision(division.divisionId);
    // this.store.dispatch(new adminActions.SetSelectedDivision(division));
    this.#router.navigate(['./admin/division/edit']);
  }
  viewTeams(division: any) {
    console.log(division);
    // Always set selected first (this also syncs current via service)
    this.divisionService.updateSelectedDivision(division);
    console.log(this.divisionService.selectedDivision());
    this.#router.navigate(['./admin/season-setup']);
  }
  getRecord(division: any) {
    //this.divisionService.setCurrentDivision(division.divisionId);
    // Always set selected first (this also syncs current via service)
    this.divisionService.updateSelectedDivision(division);
    console.log(this.divisionService.selectedDivision());
    //this.divisionService.getDvision(division);
    //console.log(this.divisionService.currentDivision());
    // this.store.dispatch(new adminActions.SetSelectedDivision(division));
    this.#router.navigate(['./admin/division/edit']);
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
