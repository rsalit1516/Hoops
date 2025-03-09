import { Component, OnInit, inject } from '@angular/core';
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
import { LocationService } from '@app/admin/admin-shared/services/location.service';
import { AdminShellSidebarComponent } from '@app/admin/components/admin-shell-sidebar/admin-shell-sidebar.component';
import { SeasonService } from '@app/services/season.service';
import { DivisionService } from '@app/services/division.service';

@Component({
  selector: 'csbc-admin-shell',
  template: ` <div class="container mx-auto px-4 admin-container">
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
  seasonService = inject(SeasonService);
  colorService = inject(ColorService);
  locationService = inject(LocationService);
  store = inject(Store<fromAdmin.State>);
  divisionService = inject(DivisionService);

  constructor () { }

  ngOnInit () {
    this.seasonService.getCurrentSeason().subscribe((season) => {
      this.seasonService.selectedSeason.set(season);
      this.divisionService.season = season;
      this.divisionService.getDivisionsData(season!.seasonId!);
      console.log(season);
    });
    this.store.dispatch(new adminActions.LoadSeasons());
    this.store.select(fromAdmin.getSeasons).subscribe((seasons) => {
      // console.log('triggering seasons');
      this.store.select(fromAdmin.getSelectedSeason).subscribe((season) => {
        console.log(season);
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
      console.log(season);
      if (season.seasonId !== undefined) {
        if (season.seasonId !== 0) {
          this.store.dispatch(new adminActions.LoadDivisions());
          this.store.dispatch(new adminActions.LoadSeasonTeams());
          this.store.dispatch(new adminActions.LoadGames());
          // this.store.dispatch(new adminActions.LoadPlayoffGames());
          this.store
            .select(fromAdmin.getSeasonDivisions)
            .subscribe((divisions) => {
              this.store.dispatch(
                new adminActions.SetSelectedDivision(divisions[0])
              );
            });

          this.store
            .select(fromAdmin.getSelectedDivision)
            .subscribe((division) => {
              if (division !== undefined) {
                this.store.dispatch(new adminActions.LoadDivisionTeams());
              }
            });
        }
      }
    });
    this.store.dispatch(new contentActions.LoadAdminContent());

    this.store.dispatch(new contentActions.SetAllContent());
    this.store.select(fromAdmin.getContentList).subscribe((content) => {
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
