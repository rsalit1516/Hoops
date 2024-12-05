import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';

import * as adminActions from '../../state/admin.actions';
import * as contentActions from '../../state/admin.actions';
import * as fromAdmin from '../../state';
import { ColorService } from '@app/admin/admin-shared/services/color.service';
import { CommonModule, NgIf } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LocationService } from '@app/admin/admin-shared/services/location.service';
import { AdminShellSidebarComponent } from '@app/admin/components/admin-shell-sidebar/admin-shell-sidebar.component';

@Component({
    selector: 'csbc-admin-shell',
    template: `
  <div class="container-fluid">
  <div class="row">
    <div class="col-2 nav-wrapper">
  <app-admin-shell-sidebar></app-admin-shell-sidebar>

    </div>
    <div class="col-10">
      <router-outlet></router-outlet>
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
    ]
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
  colorService = inject(ColorService);
  locationService = inject(LocationService);
  store = inject(Store<fromAdmin.State>);

  constructor() {}

  ngOnInit() {
    this.store.dispatch(new contentActions.LoadAdminContent());
    this.store.dispatch(new adminActions.LoadSeasons());
    this.store.select(fromAdmin.getSeasons).subscribe((seasons) => {
       console.log('triggering seasons')
       this.store.select(fromAdmin.getSelectedSeason).subscribe((season) => {
         // console.log(season);
         if (season.seasonId === undefined) {
          for (let i = 0; i < seasons.length; i++) {
            if (seasons[i].currentSeason === true) {
              this.store.dispatch(
                new adminActions.SetSelectedSeason(seasons[i])
              );
              break;
            }
          }
        }
       });
    });
    this.store.select(fromAdmin.getSelectedSeason).subscribe((season) => {
      // console.log(season);
      if (season.seasonId !== undefined) {
        if (season.seasonId !== 0) {
          this.store.dispatch(new adminActions.LoadDivisions());
          this.store.dispatch(new adminActions.LoadSeasonTeams());
          this.store.dispatch(new adminActions.LoadGames());
          // this.store.dispatch(new adminActions.LoadPlayoffGames());
          this.store.select(fromAdmin.getSeasonDivisions).subscribe((divisions) => {
            this.store.dispatch(new adminActions.SetSelectedDivision(divisions[ 0 ]));
          });

          this.store.select(fromAdmin.getSelectedDivision).subscribe((division) => {
            if (division !== undefined) {
              this.store.dispatch(new adminActions.LoadDivisionTeams());
            }
          });
        }
      }
    });

    this.store.select(fromAdmin.getContentList).subscribe((content) => {
      console.log(content);
      console.log('Setting active content');
      this.store.dispatch(new contentActions.SetActiveContent());
    });

    // this.store.select(fromAdmin.getSeasonDivisions).subscribe((divisions) => {
    //   this.store.dispatch(new adminActions.SetSelectedDivision(divisions[0]));
    // });
    // this.store.select(fromAdmin.getSeasonTeams).subscribe((teams) => {
    //   this.store.select(fromAdmin.getSelectedDivision).subscribe((division) => {
    //     if (division !== undefined) {
    //       this.store.dispatch(new adminActions.LoadDivisionTeams());
    //     }
    //   });
    // });

    this.colorService
      .getColors()
      .subscribe((colors) =>
        this.store.dispatch(new adminActions.SetColors(colors))
      );
    this.locationService
      .get()
      .subscribe((locations) =>
        this.store.dispatch(new adminActions.SetLocations(locations))
      );
  }
}
