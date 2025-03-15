import { Component, OnInit, inject, input } from '@angular/core';
import { SeasonService } from '@app/services/season.service';
import { DivisionService } from '@app/services/division.service';
import { TeamService } from '@app/services/team.service';
import { GameService } from '@app/services/game.service';
import { Store, select } from '@ngrx/store';

import * as fromGames from '../../state';
import * as fromUser from '../../../user/state';

import * as gameActions from '../../state/games.actions';
import { RegularGame } from '@app/domain/regularGame';
import { Team } from '@app/domain/team';
import { Division } from '@app/domain/division';
import { Observable, from, zip, of } from 'rxjs';
import { Standing } from '@app/domain/standing';
import { User } from '@app/domain/user';
import { SchedulePlayoffsComponent } from '@app/games/components/schedule-playoffs/schedule-playoffs.component';
import { RouterOutlet } from '@angular/router';
import { GamesTopMenuComponent } from '../../components/games-top-menu/games-top-menu.component';

@Component({
  selector: 'csbc-games-shell',
  templateUrl: './games-shell.component.html',
  styleUrls: ['./games-shell.component.scss'],
  imports: [GamesTopMenuComponent, RouterOutlet]
})
export class GamesShellComponent implements OnInit {
  readonly #seasonService = inject(SeasonService);
  readonly #divisionService = inject(DivisionService);
  readonly #teamService = inject(TeamService);
  private _gameService = inject(GameService);
  private store = inject(Store<fromGames.State>);
  private userStore = inject(Store<fromUser.State>);

  readonly showAllTeams = input<boolean>();
  readonly currentTeam = input<string>();
  teamList: any[] | undefined;
  filteredGames$: Observable<RegularGame[]> | undefined;
  standings$: Observable<Standing[]> | undefined;
  teams: any;
  user$ = this.userStore
    .pipe(select(fromUser.getCurrentUser))
    .subscribe((user) => (this.user = user));
  allGames$: Observable<RegularGame[]> | undefined;
  errorMessage: any;
  selectedDivisionId$: Observable<number> | undefined;
  teams$: Observable<Team[]> | undefined;
  selectedTeam$: Observable<Team> | undefined;
  errorMessage$: Observable<string> | undefined;
  selectedDivision$: Observable<any> | undefined;
  standings: RegularGame[] | undefined;
  canEdit: boolean | undefined;
  user: User | undefined;
  games: RegularGame[] | undefined;
  currentSeason$: Observable<any> | undefined; // = this.seasonService.currentSeason$.subscribe(season => this.seasonDescription = season.description);
  seasonDescription: string | undefined;
  // divisions$ = this.divisionService.divisions();
  games$ = this._gameService.seasonGames$;

  // TODO: this is a bug that needs to be fixed!
  // gameDivisionFilter$ = this._gameService.games$
  // .pipe(
  //   map(games =>
  //     games.filter(game =>
  //       this.selectedDivisionId ? game.DivisionID === this.selectedDivisionId  : true)
  // ) as Game[]);
  divisionId: any;
  divisionId$!: Observable<number> | undefined;
  selectedDivisionId: number;
  divisions!: Division[];
  currentDivision: Division | undefined;
  filteredTeams!: Team[];
  filteredGames!: RegularGame[];
  filteredGamesByDate!: Observable<RegularGame[]>;
  constructor () {
    this.selectedDivisionId = 1;
  }

  ngOnInit () {
    this.setStateSubscriptions();
  }
  setStateSubscriptions () {
    this.store
      .select(fromGames.getDivisions)
      .subscribe((divisions) => (this.divisions = divisions));
    this.divisionId$ = this.store.pipe(
      select(fromGames.getCurrentDivisionId)
    ) as Observable<number>;

    // this.filteredGames$ = this.store.pipe(select(fromGames.getFilteredGames));
    // this.standings$ = this.store.pipe(select(fromGames.getStandings));
    this.store.select(fromGames.getDivisions).subscribe((divisions) => {
      if (divisions[0]) {
        this.store.dispatch(new gameActions.SetCurrentDivision(divisions[0]));
      }
    });

    this.store.pipe(select(fromUser.getCurrentUser)).subscribe((user) => {
      this.user = user;
    });
    this.store.select(fromGames.getCurrentDivision).subscribe((division) => {
      this.currentDivision = division;
      const divId = division?.divisionId as number;
      console.log(division);
      if (division) {
        this.store.dispatch(new gameActions.LoadFilteredTeams());
        this.store.dispatch(new gameActions.LoadFilteredGames());
        this.store.dispatch(new gameActions.LoadDivisionPlayoffGames());
        this.store.select(fromGames.getFilteredTeams).subscribe((teams) => {
          this.filteredTeams = teams;
        });
      }
    });
    // this.store.select(fromGames.getFilteredGames).subscribe(games => {
    //   this.filteredGames = games;
    //   this.filteredGamesByDate = this._gameService.groupByDate(games);
    //   console.log(this.filteredGames);
    // })
  }
  public filterByDivision (divisionId: number): void {
    console.log(divisionId);
    this.teamList = [];
  }

  divisionSelected (division: Division): void {
    this.store.dispatch(new gameActions.SetCurrentDivision(division));
    console.log(this.user$);
    if (division !== undefined) {
      this.store.dispatch(
        new gameActions.SetCanEdit(
          this._gameService.getCanEdit(this.user, division.divisionId)
        )
      );
    }
  }
  teamSelected (team: Team): void {
    this.store.dispatch(new gameActions.SetCurrentTeam(team));
  }

  getCanEdit (user: User, divisionId: number): boolean {
    let canEdit = false;
    if (user && user.divisions) {
      user.divisions.forEach((element) => {
        if (divisionId === element.divisionId) {
          console.log('found ' + divisionId);
          canEdit = true;
        }
      });
    }
    return canEdit;
  }

  setDivisionData (data: any[]): Division[] {
    let divisions: Division[] = [];
    // console.log(data);
    for (let i = 0; i <= data.length; i++) {
      // console.log(data[i]);
      if (data[i] !== undefined) {
        let division: Division = {
          companyId: 1,
          seasonId: data[i].seasonId,
          divisionId: data[i].divisionId,
          divisionDescription: data[i].divisionDescription,
          minDate: data[i].minDate,
          maxDate: data[i].maxDate,
          gender: data[i].gender,
          minDate2: data[i].minDate2,
          maxDate2: data[i].maxDate2,
          gender2: data[i].gender2,
          directorId: data[i].directorId
        };
        divisions.push(division);
      }
    }
    return divisions;
  }
  setTeamData (data: any[]): Team[] {
    let teams: Team[] = [];
    for (let i = 0; i <= data.length; i++) {
      if (data[i] !== undefined) {
        let team: Team = new Team();
        team.teamId = data[i].teamID;
        team.name = data[i].teamNumber;
        team.teamColorId = data[i].colorID;
        team.divisionId = data[i].divisionId;
        teams.push(team);
      }
      console.log(teams);
    }
    return teams;
  }
  handlefilterUpdate ($event: any) {
    console.log($event);
  }
}
