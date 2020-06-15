import { Component, OnInit, Input } from '@angular/core';
import { SeasonService } from 'app/services/season.service';
import { DivisionService } from 'app/services/division.service';
import { TeamService } from 'app/services/team.service';
import { GameService } from '../../game.service';
import { Store, select } from '@ngrx/store';

import * as fromGames from '../../state';
import * as fromUser from '../../../user/state';

import * as gameActions from '../../state/games.actions';
import { Game } from 'app/domain/game';
import { Team } from 'app/domain/team';
import { Division } from 'app/domain/division';
import { Season } from 'app/domain/season';
import { Observable, from, zip, of } from 'rxjs';
import { Standing } from 'app/domain/standing';
import { map } from 'rxjs-compat/operator/map';
import {
  groupBy,
  mergeMap,
  toArray,
  tap,
  flatMap,
  concatMap
} from 'rxjs/operators';
import * as moment from 'moment';
import { User } from 'app/domain/user';

@Component({
  selector: 'csbc-games-shell',
  templateUrl: './games-shell.component.html',
  styleUrls: ['./games-shell.component.scss']
})
export class GamesShellComponent implements OnInit {
  @Input() showAllTeams: boolean;
  @Input() currentTeam: string;
  teamList: any[];
  filteredGames$: Observable<Game[]>;
  standings$: Observable<Standing[]>;
  teams: any;
  user$ = this.userStore
    .pipe(select(fromUser.getCurrentUser))
    .subscribe(user => (this.user = user));
  allGames$: Observable<Game[]>;
  errorMessage: any;
  // currentSeason$: Observable<Season>;
  // divisions$: Observable<Division[]>;
  selectedDivisionId$: Observable<number>;
  teams$: Observable<Team[]>;
  selectedTeam$: Observable<Team>;
  errorMessage$: Observable<string>;
  selectedDivision$: Observable<any>;
  standings: Game[];
  canEdit: boolean;
  user: User;
  games: Game[];
  currentSeason$: Observable<any>; // = this.seasonService.currentSeason$.subscribe(season => this.seasonDescription = season.description);
  seasonDescription: string;
  divisions$ = this.divisionService.divisions$;
  games$ = this._gameService.games$;
  // TODO: this is a bug that needs to be fixed!
  // gameDivisionFilter$ = this._gameService.games$
  // .pipe(
  //   map(games =>
  //     games.filter(game =>
  //       this.selectedDivisionId ? game.DivisionID === this.selectedDivisionId  : true)
  // ) as Game[]);
  selectedDivisionId: 1;
  constructor(
    private seasonService: SeasonService,
    private divisionService: DivisionService,
    private _teamService: TeamService,
    private _gameService: GameService,
    private store: Store<fromGames.State>,
    private userStore: Store<fromUser.State>
  ) {}

  ngOnInit () {
    this.store.dispatch(new gameActions.LoadCurrentSeason());
    this.setStateSubscriptions();

    this._gameService.gamesWithDivision$.pipe(tap(test => console.log(test)));

    // this.seasonService.currentSeason$.subscribe(season => {
    //   // this.store.dispatch(new gameActions.SetCurrentSeason(season));
    //   this.store.dispatch(new gameActions.LoadDivisions());
    //   this.store.pipe(select(fromGames.divisions)).subscribe(divisions => {
    //     if (divisions.length > 0) {
    //       console.log(divisions);
    //       this.store.dispatch(new gameActions.SetCurrentDivision(divisions[0]));
    //       this.divisionSelected(divisions[0]);
    //     }
    //   });
    // this.store.dispatch(new gameActions.LoadFilteredGames());

    // });
  }
  setStateSubscriptions() {
    this.store.select(fromGames.getCurrentSeason).subscribe(season => {
      console.log(season);
      const t = this._gameService.currentSeason$; // = season.seasonID;
      this.store.dispatch(new gameActions.LoadDivisions());
      this.store.dispatch(new gameActions.LoadStandings());
      this.store.dispatch(new gameActions.LoadTeams());
      // this.store.dispatch(new gameActions.Load());
    });
    //  this.currentSeason$ = this.store.pipe(
    //    select(fromGames.getCurrentSeason),
    //    tap(season => console.log(season))
    //  );
    // this.divisions$ = this.store.pipe(
    //   select(fromGames.getDivisions),
    //   tap(divisions => console.log(divisions))
    // );
    // this.selectedDivisionId$ = this.store.pipe(
    //   select(fromGames.getCurrentDivisionId),
    //   tap(division => console.log(division))
    // );
    // this.selectedTeam$ = this.store.pipe(select(fromGames.getCurrentTeam));
    // this.allGames$ = this.store.pipe(select(fromGames.getGames));

    this.games$ = this.store.pipe(
      select(fromGames.getGames),
      tap(division => console.log(division))
    );
    this.filteredGames$ = this.store.pipe(select(fromGames.getFilteredGames));
    this.standings$ = this.store.pipe(select(fromGames.getStandings));
    this.store.pipe(select(fromUser.getCurrentUser)).subscribe(user => {
      this.user = user;
    });
  }
  public filterByDivision(divisionId: number): void {
    console.log(divisionId);
    this.teamList = [];
  }

  divisionSelected(division: Division): void {
    this.store.dispatch(new gameActions.SetCurrentDivision(division));
    console.log(this.user$);
    if (division !== undefined) {
      // this.canEdit = this._gameService.setCanEdit(division);
      this.store.dispatch(new gameActions.SetCanEdit(this._gameService.getCanEdit(this.user, division.divisionID)));
      // console.log(this.canEdit);
      this.store.dispatch(new gameActions.LoadStandings());
    }
  }
  teamSelected(team: Team): void {
    this.store.dispatch(new gameActions.SetCurrentTeam(team));
  }

  getCanEdit(user: User, divisionId: number): boolean {
    // console.log(divisionId);
    // console.log(user);
    let canEdit = false;
    if (user) {
      user.divisions.forEach(element => {
        if (divisionId === element.divisionID) {
          console.log('found ' + divisionId);
          canEdit = true;
        }
      });
    }
    return canEdit;
  }

  setDivisionData(data: any[]): Division[] {
    let divisions: Division[] = [];
    // console.log(data);
    for (let i = 0; i <= data.length; i++) {
      // console.log(data[i]);
      if (data[i] !== undefined) {
        let division: Division = {
          seasonID: data[i].seasonID,
          divisionID: data[i].divisionID,
          div_Desc: data[i].div_Desc,
          minDate: data[i].minDate,
          maxDate: data[i].maxDate
        };
        divisions.push(division);
      }
      // console.log(divisions);
    }
    return divisions;
  }
  setTeamData(data: any[]): Team[] {
    let teams: Team[] = [];
    for (let i = 0; i <= data.length; i++) {
      // console.log(data[i]);
      if (data[i] !== undefined) {
        let team: Team = new Team();
        team.id = data[i].teamID;
        team.name = data[i].teamNumber;
        team.color = data[i].colorID;
        team.divisionId = data[i].divisionID;
        teams.push(team);
      }
      console.log(teams);
    }
    return teams;
  }
}
