/* NgRx */
import { Action } from '@ngrx/store';
import { Division } from 'app/domain/division';
import { Team } from 'app/domain/team';
import { Season } from 'app/domain/season';
import { Game } from 'app/domain/game';

export enum AdminActionTypes {
  LoadCurrentSeason = '[Admin] Load Current Season',
  SetCurrentSeason = '[Admin] Set Current Season',
  LoadGames = '[Admin] Load Games',
  LoadGamesSuccess = '[Admin] Load Games Success',
  LoadGamesFail = '[Admin] Load GamesFail',
  LoadSeasons = '[Admin] Load Seasons',
  LoadSeasonsSuccess = '[Admin] Load Seasons Success',
  LoadSeasonsFail = '[Admin] Load Seasons Fail',
  GetCurrentSeason = '[Admin] Get Current Season',
  SetSelectedSeason = '[Admin] Set Selected Season',
  SetSelectedSeasonId = '[Admin] Set Selected Season ID',
  LoadDivisions = '[Admin] Load All Season Divisions',
  LoadDivisionsSuccess = '[Admin API] Load Divisions Success',
  LoadDivisionsFail = '[Admin API] Load Divisions File',
  SetSelectedDivision = '[Admin] Set Selected Division',
  LoadTeams = '[Admin] Load All Season Divisions',
  LoadTeamsSuccess = '[Admin API] Load Divisions Success',
  LoadTeamsFail = '[Admin API] Load Teams File',
  SetSelectedTeam = '[Admin] Set Selected Division'
}
export class LoadCurrentSeason implements Action {
  readonly type = AdminActionTypes.LoadCurrentSeason;
}
export class LoadGames implements Action {
  readonly type = AdminActionTypes.LoadGames;
}
export class LoadGamesSuccess implements Action {
  readonly type = AdminActionTypes.LoadGamesSuccess;
  constructor(public payload: Game[]) {}
}

export class LoadGamesFail implements Action {
  readonly type = AdminActionTypes.LoadGamesFail;
  constructor(public payload: string) {}
}
export class LoadSeasons implements Action {
  readonly type = AdminActionTypes.LoadSeasons;
}
export class LoadSeasonsSuccess implements Action {
  readonly type = AdminActionTypes.LoadSeasonsSuccess;
  constructor(public payload: Season[]) {}
}

export class LoadSeasonsFail implements Action {
  readonly type = AdminActionTypes.LoadSeasonsFail;
  constructor(public payload: string) {}
}
export class GetCurrentSeason implements Action {
  readonly type = AdminActionTypes.GetCurrentSeason;
  constructor(public payload: Season) {}
}
export class SetSelectedSeason implements Action {
  readonly type = AdminActionTypes.SetSelectedSeason;
  constructor(public payload: Season) {
    // currentS
  }
}
export class SetCurrentSeason implements Action {
  readonly type = AdminActionTypes.SetCurrentSeason;
  constructor(public payload: Season) {
    // console.log(payload);
  }
}
export class SetSelectedSeasonId implements Action {
  readonly type = AdminActionTypes.SetSelectedSeasonId;
  constructor(public payload: number) {
    // currentS
  }
}

export class LoadDivisions implements Action {
  readonly type = AdminActionTypes.LoadDivisions;
}
export class LoadDivisionsSuccess implements Action {
  readonly type = AdminActionTypes.LoadDivisionsSuccess;
  constructor(public payload: Division[]) {
    console.log(payload);
  }
}

export class LoadDivisionsFail implements Action {
  readonly type = AdminActionTypes.LoadDivisionsFail;
  constructor(public payload: string) {}
}
export class SetSelectedDivision implements Action {
  readonly type = AdminActionTypes.SetSelectedDivision;
  constructor(public payload: Division) {}
}
export class LoadTeams implements Action {
  readonly type = AdminActionTypes.LoadTeams;
}
export class LoadTeamsSuccess implements Action {
  readonly type = AdminActionTypes.LoadTeamsSuccess;
  constructor(public payload: Division[]) {
    console.log(payload);
  }
}

export class LoadTeamsFail implements Action {
  readonly type = AdminActionTypes.LoadTeamsFail;
  constructor(public payload: string) {}
}
export class SetSelectedTeam implements Action {
  readonly type = AdminActionTypes.SetSelectedTeam;
  constructor(public payload: Team) {}
}

export type AdminActions =
  | LoadCurrentSeason
  | SetCurrentSeason
  | LoadGames
  | LoadGamesSuccess
  | LoadGamesFail
  | LoadSeasons
  | LoadSeasonsSuccess
  | LoadSeasonsFail
  | GetCurrentSeason
  | SetSelectedSeason
  | SetSelectedSeasonId
  | LoadDivisions
  | LoadDivisionsSuccess
  | LoadDivisionsFail
  | SetSelectedDivision
  | LoadTeams
  | LoadTeamsSuccess
  | LoadTeamsFail
  | SetSelectedTeam;
