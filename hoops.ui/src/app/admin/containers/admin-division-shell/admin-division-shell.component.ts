import { Component, OnInit, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromAdmin from '../../state';
import * as adminActions from '../../state/admin.actions';
import { DivisionListComponent } from '../../admin-divisions/admin-division-list/divisionList.component';
import { SeasonSelectComponent } from '../../admin-shared/season-select/season-select.component';
import { DivisionSelectComponent } from '@app/admin/admin-shared/division-select/division-select.component';
import { Season } from '@app/domain/season';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Division } from '@app/domain/division';
import { DivisionService } from '@app/services/division.service';
import { NewDivisionSelectorComponent } from '../../admin-shared/new-division-selector/new-division-selector.component';

@Component({
  selector: 'csbc-admin-division-shell',
  template: `<section class="container-fluid">
    <h2>{{ title }}</h2>
    <router-outlet></router-outlet>
  </section>`,
  styleUrls: [
    '../../../shared/scss/forms.scss',
    '../../admin.component.scss',
    './admin-division-shell.component.scss',
  ],
  imports: [
    CommonModule,
    SeasonSelectComponent,
    DivisionListComponent,
    DivisionSelectComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    NewDivisionSelectorComponent,
    RouterOutlet,
    RouterLinkWithHref,
  ],
  providers: [DivisionService],
})
export class AdminDivisionShellComponent implements OnInit {
  season = input(new Season());
  router = inject(Router);
  _divisionService = inject(DivisionService);
  title = 'Divisions';
  constructor (private store: Store<fromAdmin.State>) { }

  ngOnInit () {
    // this.store.dispatch(new adminActions.LoadSeasons());
    //this.store.dispatch(new adminActions.LoadLocations());
  }
  addDivision () {
    console.log('Add Division');
    let division = new Division();
    this._divisionService.updateSelectedDivision(division);
    // this.store.dispatch(new adminActions.SetSelectedDivision(division));

    this.router.navigate(['./admin/division-detail']);
  }
}
