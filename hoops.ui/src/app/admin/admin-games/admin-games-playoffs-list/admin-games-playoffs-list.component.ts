import { Component, effect, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { PlayoffGame } from '@app/domain/playoffGame';
import * as fromAdmin from '../../state';
import * as adminActions from '../../state/admin.actions';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayoffGameService } from '@app/services/playoff-game.service';

@Component({
  selector: 'csbc-admin-games-playoffs-list',
  templateUrl: './admin-games-playoffs-list.component.html',
  styleUrls: ['./admin-games-playoffs-list.component.scss',
    '../../admin.component.scss',
    '../../../shared/scss/tables.scss',
  ],
  imports: [FormsModule, NgIf, MatTableModule, MatButtonModule,
    MatIconModule, DatePipe,
    AdminGamesPlayoffsListComponent]
})
export class AdminGamesPlayoffsListComponent implements OnInit {
  gameService = inject(PlayoffGameService);
  title = 'Playoff Games';
  dataSource!: MatTableDataSource<PlayoffGame>;
  clickedRows = new Set<PlayoffGame>();
  currentScreenWidth: any;
  games!: PlayoffGame[];
  canEdit = false;

  displayedColumns!: string[];
  flexMediaWatcher: any;
  constructor (private store: Store<fromAdmin.State>,
    public dialog: MatDialog) {
    effect(() => {
      console.log(this.gameService.divisionPlayoffGames());
      this.dataSource = new MatTableDataSource(this.gameService.divisionPlayoffGames()!);
      console.log(this.dataSource);
    });
    // private media: MediaObserver

    // this.flexMediaWatcher = media.media$.subscribe((change) => {
    //   if (change.mqAlias !== this.currentScreenWidth) {
    // this.currentScreenWidth = change.mqAlias;
    this.setupTable();
    //   }
    // });

  }

  ngOnInit (): void {

  }
  setupTable () {
    this.displayedColumns = [
      'gameDate',
      'gameTime',
      'locationName',
      'homeTeam',
      'visitingTeam',
      'homeTeamScore',
      'visitingTeamScore',
    ];
    if (this.currentScreenWidth === 'xs') {
      // only display internalId on larger screens
      //this.displayedColumns.shift(); // remove 'internalId'
      this.displayedColumns = [
        'gameDate',
        'gameTime',
        'locationName',
        'homeTeamName',
        'visitingTeamName',
      ];
    }
    this.dataSource = new MatTableDataSource(this.games);
  }
  editGame (game: PlayoffGame) {
    // TODO: implement this method
  }
  selectRow (row: any) {
    console.log(row);
    this.store.dispatch(new adminActions.SetSelectedGame(row));
  }
}
