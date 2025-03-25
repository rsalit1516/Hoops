import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';

import * as fromAdmin from '../../state';
import * as adminActions from '../../state/admin.actions';
import { Season } from '@app/domain/season';
import { SeasonService } from '@app/services/season.service';

@Component({
    selector: 'csbc-admin-seasons-toolbar',
    imports: [
        MatFormFieldModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatToolbarModule,
        MatCheckboxModule,
    ],
  template: `
    <mat-toolbar>
  <mat-toolbar-row>
    <div>
      <button mat-raised-button type="button" (click)="addSeason()">New</button>
    </div>
  </mat-toolbar-row>
</mat-toolbar>`,
    styleUrls: [
        './../../../shared/scss/forms.scss',
        './../../admin.component.scss',
    ]
})
export class AdminSeasonsToolbarComponent implements OnInit {
  readonly #seasonService = inject(SeasonService)
  checked = true;
  filterForm = this.fb.group({
    activeContent: true,
  });
  title = 'Seasons List';

  constructor(
    private router: Router,
    // private store: Store<fromContent.State>,
    private fb: UntypedFormBuilder,
    private store: Store<fromAdmin.State>
  ) {}

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  addSeason() {
    const season = new Season();
    season.seasonId = 0;
    this.#seasonService.selectSeason(season);

    console.log(season);

    //this.store.dispatch(new adminActions.SetSelectedSeason(season));
    //this.router.navigate(['./admin/seasons/edit']);
  }
}
