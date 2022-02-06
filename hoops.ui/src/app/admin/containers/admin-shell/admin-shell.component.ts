import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as adminActions from '../../state/admin.actions';
import * as contentActions from '../../content/state/content.actions';
import * as fromAdmin from '../../state';
import * as fromUser from '../../../user/state';

@Component({
  selector: 'csbc-admin-shell',
  templateUrl: './admin-shell.component.html',
  styleUrls: ['./admin-shell.component.scss'],
})
export class AdminShellComponent implements OnInit {
  events: string[] = [];
  // opened: boolean;

  shouldRun = true;

  constructor(private store: Store<fromAdmin.State>) {}

  ngOnInit() {
    this.store.dispatch(new contentActions.Load());
    this.store.dispatch(new adminActions.LoadSeasons());
    this.store.select(fromAdmin.getSeasons).subscribe((seasons) => {
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
      this.store.dispatch(new adminActions.LoadDivisions());
    });
    this.store.select(fromAdmin.getSeasonDivisions).subscribe((divisions) => {
      console.log(divisions);
      this.store.dispatch(new adminActions.SetSelectedDivision(divisions[0]));
    });
  }
}
