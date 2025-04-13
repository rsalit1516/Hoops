import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { DivisionSelectComponent } from '@app/admin/admin-shared/division-select/division-select.component';
import { SeasonSelectComponent } from '@app/admin/admin-shared/season-select/season-select.component';
import { Division } from '@app/domain/division';
import { DivisionService } from '@app/services/division.service';

@Component({
  selector: 'csbc-division-toolbar',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatCheckboxModule,
    SeasonSelectComponent,
  ],
  template: `
    <mat-toolbar>
  <mat-toolbar-row>
    <div class="flex">
      <div class="flex-1 pt-4">
      <button mat-raised-button type="button" (click)="addDivision()">New</button>
      </div>
    <div class="flex-1 pt-4">
      <season-select></season-select>
    </div>
      </div>
  </mat-toolbar-row>
</mat-toolbar>`,
  styleUrls: [
    '../../admin.component.scss',
    '../../containers/admin-shell/admin-shell.component.scss',
    '../../../shared/scss/cards.scss',
    '../../../shared/scss/sidenav.scss',
  ]
})
export class DivisionToolbarComponent {
  readonly #router = inject(Router);
  readonly #divisionService = inject(DivisionService);

  addDivision() {
    let division = new Division();
    this.#divisionService.updateSelectedDivision(division);
    this.#router.navigate([ './admin/division/edit' ]);
  }
}
