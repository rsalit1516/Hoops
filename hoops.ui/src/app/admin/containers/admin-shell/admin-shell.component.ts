import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as adminActions from '../../state/admin.actions';
import * as contentActions from '../../content/state/content.actions';
import * as fromAdmin from '../../state';
import * as fromUser from '../../../user/state';
import { ColorService } from '@app/admin/admin-shared/services/color.service';

@Component({
  selector: 'csbc-admin-shell',
  templateUrl: './admin-shell.component.html',
  styleUrls: ['./admin-shell.component.scss'],
})
export class AdminShellComponent implements OnInit {
  events: string[] = [];
  // opened: boolean;

  shouldRun = true;

  constructor(private store: Store<fromAdmin.State>, private colorService: ColorService) {}

  ngOnInit() {
    this.store.dispatch(new contentActions.Load());
    this.store.dispatch(new adminActions.LoadSeasons());
    this.store.select(fromAdmin.getSeasons).subscribe((seasons) => {
      this.store.select(fromAdmin.getSelectedSeason).subscribe((season) => {
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
      if (season !== undefined) {
        this.store.dispatch(new adminActions.LoadDivisions());
        this.store.dispatch(new adminActions.LoadSeasonTeams());
      }
    });

    this.store.select(fromAdmin.getSeasonDivisions).subscribe((divisions) => {
      this.store.dispatch(new adminActions.SetSelectedDivision(divisions[0]));
    });

    this.store.select(fromAdmin.getSelectedDivision).subscribe((division) => {
      if (division !== undefined) {
        this.store.dispatch(new adminActions.LoadDivisionTeams());
      }
    });

    this.store.select(fromAdmin.getSeasonDivisions).subscribe((divisions) => {
      this.store.dispatch(new adminActions.SetSelectedDivision(divisions[0]));
    });
    this.store.select(fromAdmin.getSeasonTeams).subscribe((teams) => {
      this.store.select(fromAdmin.getSelectedDivision).subscribe((division) => {
        if (division !== undefined) {
          this.store.dispatch(new adminActions.LoadDivisionTeams());
        }
      })});

    this.colorService.getColors().subscribe(colors =>
    this.store.dispatch(new adminActions.SetColors(colors)));
  }
}
