import { Component, OnInit, inject, input , ChangeDetectionStrategy } from '@angular/core';
import { Season } from '@app/domain/season';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterOutlet } from '@angular/router';

import { Division } from '@app/domain/division';
import { DivisionService } from '@app/services/division.service';
import { LoggerService } from '@app/services/logger.service';

import { ShellTitle } from "../../../shared/components/shell-title/shell-title";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'csbc-admin-division-shell',
  template: `<section class="container">
    <csbc-shell-title [title]="title"/>
    <router-outlet />
  </section>`,
  styleUrls: [
    '../../../shared/scss/forms.scss',
    '../../admin.scss',
    './admin-division-shell.scss',
  ],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    RouterOutlet,
    ShellTitle
],
})
export class AdminDivisionShell implements OnInit {
  private logger = inject(LoggerService);

  season = input(new Season());
  router = inject(Router);
  _divisionService = inject(DivisionService);
  title = 'Division Management';

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);
  constructor () { }

  ngOnInit () {
    // this.store.dispatch(new adminActions.LoadSeasons());
    //this.store.dispatch(new adminActions.LoadLocations());
  }
  addDivision () {
    this.logger.info('Adding new division');
    let division = new Division();
    this._divisionService.updateSelectedDivision(division);
    // this.store.dispatch(new adminActions.SetSelectedDivision(division));

    this.router.navigate(['./admin/division/edit']);
  }
}
