import { Component, OnInit, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromAdmin from '../../state';
import * as adminActions from '../../state/admin.actions';
import { DivisionListComponent } from '../../components/admin-division-list/divisionList.component';
import { SeasonSelectComponent } from '../../admin-shared/season-select/season-select.component';
import { DivisionSelectComponent } from '@app/admin/admin-shared/division-select/division-select.component';
import { Season } from '@app/domain/season';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { Division } from '@app/domain/division';
import { DivisionService } from '@app/services/division.service';
import { NewDivisionSelectorComponent } from '../../admin-shared/new-division-selector/new-division-selector.component';

@Component({
    selector: 'csbc-admin-division-shell',
    templateUrl: './admin-division-shell.component.html',
    styleUrls: [
        '../../../shared/scss/forms.scss',
        '../../admin.component.scss',
        './admin-division-shell.component.scss',
    ],
    imports: [
        SeasonSelectComponent,
        DivisionListComponent,
        DivisionSelectComponent,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        NewDivisionSelectorComponent,
    ]
})
export class AdminDivisionShellComponent implements OnInit {
  season = input(new Season());
  private router = inject(Router);
  private _divisionService = inject(DivisionService);

  constructor(private store: Store<fromAdmin.State>) {}

  ngOnInit() {
    this.store.dispatch(new adminActions.LoadSeasons());
    //this.store.dispatch(new adminActions.LoadLocations());
  }
  addDivision() {
    console.log('Add Division');
    let division = new Division();
    this._divisionService.setCurrentDivision(division);
    this.store.dispatch(new adminActions.SetSelectedDivision(division));

    this.router.navigate(['./admin/division-detail']);
  }
}
