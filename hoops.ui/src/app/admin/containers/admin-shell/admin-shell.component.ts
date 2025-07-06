import { Component, OnInit, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import * as adminActions from '../../state/admin.actions';
import * as contentActions from '../../state/admin.actions';
import * as fromAdmin from '../../state';
import { ColorService } from '@app/admin/admin-shared/services/color.service';
import { CommonModule, NgIf } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LocationService } from '@app/services/location.service';
import { AdminShellSidebarComponent } from '@app/admin/components/admin-shell-sidebar/admin-shell-sidebar.component';
import { SeasonService } from '@app/services/season.service';
import { DivisionService } from '@app/services/division.service';
import { Observable } from 'rxjs';
import { Season } from '@app/domain/season';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'csbc-admin-shell',
  template: ` <div class="w-full mx-2 px-4 admin-container">
    <div class="flex flex-wrap -mx-2">
      <div class="w-2/12 px-2 nav-wrapper">
        <app-admin-shell-sidebar class=""></app-admin-shell-sidebar>
      </div>
      <div class="w-10/12 px-2">
        <router-outlet class=""></router-outlet>
      </div>
    </div>
  </div>`,
  styleUrls: ['./admin-shell.component.scss'],
  imports: [
    CommonModule,
    AdminShellSidebarComponent,
    MatListModule,
    RouterLink,
    RouterLinkActive,
    MatDividerModule,
    NgIf,
    RouterOutlet,
  ],
})
export class AdminShellComponent implements OnInit {
  events: string[] = [];
  // opened: boolean;
  showDirectors = false;
  showHouseholds = false;
  showPeople = false;
  showColors = false;
  showUsers = false;
  shouldRun = true;
  readonly #seasonService = inject(SeasonService);
  #colorService = inject(ColorService);
  #locationService = inject(LocationService);
  store = inject(Store<fromAdmin.State>);
  divisionService = inject(DivisionService);
  // seasons$: Observable<Season[]>;
  //selectedSeason = signal<Season | undefined>(undefined);
  // seasons = toSignal(this.store.select(fromAdmin.getSeasons));
  // selectedSeason = toSignal(this.store.select(fromAdmin.getSelectedSeason));

  constructor () {
    //    this.store.dispatch(new adminActions.LoadSeasons());
  }

  ngOnInit () {
    this.#seasonService.fetchSeasons();

    this.#seasonService.getCurrentSeason().subscribe((season) => {
      this.#seasonService.updateSelectedSeason(season!);
      console.log(this.#seasonService.selectedSeason);
    });
    this.#colorService.fetchColors();
    this.#locationService.fetchLocations();
  }

}
