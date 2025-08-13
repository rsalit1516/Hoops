import { Component, OnInit, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromAdmin from '../../state';
import { DivisionList } from '../admin-division-list/divisionList';
import { SeasonSelect } from '../../admin-shared/season-select/season-select';
import { DivisionSelect } from '@app/admin/admin-shared/division-select/division-select';
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
import { NewDivisionSelector } from '../../admin-shared/new-division-selector/new-division-selector';
import { ShellTitle } from "../../../shared/components/shell-title/shell-title";

@Component({
  selector: 'csbc-admin-division-shell',
  template: `<section class="container">
    <csbc-shell-title [title]="title"/>
    <router-outlet></router-outlet>
  </section>`,
  styleUrls: [
    '../../../shared/scss/forms.scss',
    '../../admin.scss',
    './admin-division-shell.scss',
  ],
  imports: [
    CommonModule,
    SeasonSelect,
    DivisionList,
    DivisionSelect,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    NewDivisionSelector,
    RouterOutlet,
    RouterLinkWithHref,
    ShellTitle
  ],
})
export class AdminDivisionShell implements OnInit {
  season = input(new Season());
  router = inject(Router);
  _divisionService = inject(DivisionService);
  title = 'Division Management';
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

    this.router.navigate(['./admin/division/edit']);
  }
}
