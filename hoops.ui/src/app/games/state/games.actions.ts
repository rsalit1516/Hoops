import { Division } from '@domain/division';
import { PlayoffGame } from '@domain/playoffGame';
import { Season } from '@domain/season';
import { Standing } from '@domain/standing';
import { Team } from '@domain/team';
import { RegularGame } from '@app/domain/regularGame';

/* NgRx */
import { Action, Store } from '@ngrx/store';

export enum GameActionTypes {
  ToggleGameCode = '[Game] Toggle Game Code',
  LoadCurrentSeason = '[Games] Load Current Season',
  LoadCurrentSeasonSuccess = '[Games] Load Current Season Success',
  LoadCurrentSeasonFail = '[Games] Load Current Season Fail',
  SetCurrentSeason = '[Games] Set Current Season',
  SetCurrentDivision = '[Game] Set Current Division',
  SetCurrentDivisionId = '[Game] Set Current DivisionId',
  SetCurrentTeam = '[Game] Set Current Team',
  ClearCurrentGame = '[Game] Clear Current Game',
  SetGames = '[Games] Set Games',
  SetPlayoffGames = '[Games] Set Playoff Games',
  SetDivisions = '[Games] Set Divisions',
  SetTeams = '[Games] Set Teams',
  SetAllTeams = '[Games] Set AllTeams',
  InitializeCurrentGame = '[Game] Initialize Current Game',
  LoadGames = '[Game] All Games Load',
  LoadGamesSuccess = '[Game] Load All Games Success',
  LoadGamesFail = '[Game] Load All Games Fail',
  LoadFilteredGames = '[Game] Load Filtered Games',
  LoadFilteredGamesSuccess = '[Game] Load Filtered Game Success',
  LoadFilteredGamesFail = '[Game] Load Filtered Games Fail',
  LoadFilteredGamesByTeam = '[Game] Load Filtered Games by Team',
  LoadFilteredGamesByTeamSuccess = '[Game] Load Filtered Game by Team Success',
  LoadFilteredGamesByTeamFail = '[Game] Load Filtered Games by Team Fail',
  LoadStandings = '[Game] Load Standings',
  LoadStandingsSuccess = '[Game] Load Standings Success',
  LoadStandingsFail = '[Game] Load Standings Fail',
  LoadDivisions = '[Game] Load Divisions',
  LoadDivisionsSuccess = '[Game] Load Divisions Success',
  LoadDivisionsFail = '[Game] Load Divisions Fail',
  LoadTeams = '[Game] Load Teams',
  LoadTeamsSuccess = '[Game] Load Teams Success',
  LoadTeamsFail = '[Game] Load Teams Fail',
  LoadFilteredTeams = '[Game] Load Filtered Teams',
  LoadFilteredTeamsSuccess = '[Game] Load Filtered Teams Success',
  LoadFilteredTeamsFail = '[Game] Load Filtered Teams Fail',
  SetCanEdit = '[Game] Set Can Edit Scores',
  SetCurrentGame = '[Game] Set Current Game',
  LoadPlayoffGames = '[Game] Load Playoff Games',
  LoadPlayoffGamesSuccess = '[Game] Load Playoff Games Success',
  LoadPlayoffGamesFail = '[Game] Load Playoff Games Fail',
  LoadDivisionPlayoffGames = '[Playoff Game] Load Division Playoff Games',
  LoadDivisionPlayoffGamesSuccess = '[Playoff Game] Load Division Playoff Games Success',
  LoadDivisionPlayoffGamesFail = '[Playoff Game] Load Division Playoff Games Fail',
  LoadDivisionGames = '[Game] Load Division Games',
  LoadDivisionGamesSuccess = '[Game] Load Division Games Success',
  LoadDivisionGamesFail = '[Game] Load Division Games Fail',
}

// Action Creators
export class ToggleActionList implements Action {
  readonly type = GameActionTypes.ToggleGameCode;
  constructor (public pay: boolean) { }
}
export class LoadCurrentSeason implements Action {
  readonly type = GameActionTypes.LoadCurrentSeason;
}
export class LoadCurrentSeasonSuccess implements Action {
  readonly type = GameActionTypes.LoadCurrentSeasonSuccess;
  constructor (public payload: Season | null) { }
}
export class LoadCurrentSeasonFail implements Action {
  readonly type = GameActionTypes.LoadCurrentSeasonFail;
  constructor (public payload: string) { }
}
export class SetCurrentSeason implements Action {
  readonly type = GameActionTypes.SetCurrentSeason;
  constructor (public payload: Season | null) { }
}
export class SetCurrentDivision implements Action {
  readonly type = GameActionTypes.SetCurrentDivision;
  constructor (public payload: Division) {
    console.log('set current division');
  }
}

export class SetCurrentDivisionId implements Action {
  readonly type = GameActionTypes.SetCurrentDivisionId;
  constructor (public payload: number) { }
}

export class LoadDivisionGames implements Action {
  readonly type = GameActionTypes.LoadDivisionGames;
}
export class SetCurrentTeam implements Action {
  readonly type = GameActionTypes.SetCurrentTeam;
  constructor (public payload: Team) { }
}

export class ClearCurrentGame implements Action {
  readonly type = GameActionTypes.ClearCurrentGame;
}

export class InitializeCurrentGame implements Action {
  readonly type = GameActionTypes.InitializeCurrentGame;
}

export class SetGames implements Action {
  readonly type = GameActionTypes.SetGames;
  constructor (public payload: RegularGame[]) { }
}
export class SetDivisions implements Action {
  readonly type = GameActionTypes.SetDivisions;
  constructor (public payload: Division[]) { }
}

export class SetTeams implements Action {
  readonly type = GameActionTypes.SetTeams;
  constructor (public payload: Team[]) { }
}
export class SetAllTeams implements Action {
  readonly type = GameActionTypes.SetAllTeams;
  constructor (public payload: boolean) { }
}

export class LoadGames implements Action {
  readonly type = GameActionTypes.LoadGames;
}

export class LoadGamesSuccess implements Action {
  readonly type = GameActionTypes.LoadGamesSuccess;
  constructor (public payload: RegularGame[]) { }
}

export class LoadGamesFail implements Action {
  readonly type = GameActionTypes.LoadGamesFail;

  constructor (public payload: string) { }
}
export class LoadFilteredGames implements Action {
  readonly type = GameActionTypes.LoadFilteredGames;
}

export class LoadFilteredGamesSuccess implements Action {
  readonly type = GameActionTypes.LoadFilteredGamesSuccess;
  constructor (public payload: RegularGame[]) { }
}

export class LoadFilteredGamesFail implements Action {
  readonly type = GameActionTypes.LoadFilteredGamesFail;

  constructor (public payload: string) { }
}

export class LoadFilteredGamesByTeam implements Action {
  readonly type = GameActionTypes.LoadFilteredGamesByTeam;
}

export class LoadFilteredGamesByTeamSuccess implements Action {
  readonly type = GameActionTypes.LoadFilteredGamesByTeamSuccess;
  constructor (public payload: RegularGame[]) { }
}

export class LoadFilteredGamesByTeamFail implements Action {
  readonly type = GameActionTypes.LoadFilteredGamesByTeamFail;
  constructor (public payload: string) { }
}
export class LoadStandings implements Action {
  readonly type = GameActionTypes.LoadStandings;
}
export class LoadStandingsSuccess implements Action {
  readonly type = GameActionTypes.LoadStandingsSuccess;
  constructor (public payload: Standing[]) { }
}

export class LoadStandingsFail implements Action {
  readonly type = GameActionTypes.LoadStandingsFail;

  constructor (public payload: string) { }
}
export class LoadDivisions implements Action {
  readonly type = GameActionTypes.LoadDivisions;
}
export class LoadDivisionsSuccess implements Action {
  readonly type = GameActionTypes.LoadDivisionsSuccess;
  constructor (public payload: Division[]) { }
}
export class LoadPlayoffGames implements Action {
  readonly type = GameActionTypes.LoadPlayoffGames;
}
export class LoadPlayoffGamesSuccess implements Action {
  readonly type = GameActionTypes.LoadPlayoffGamesSuccess;
  constructor (public payload: PlayoffGame[]) { }
}
export class LoadPlayoffGamesFail implements Action {
  readonly type = GameActionTypes.LoadPlayoffGamesFail;

  constructor (public payload: string) { }
}
export class LoadDivisionPlayoffGames implements Action {
  readonly type = GameActionTypes.LoadDivisionPlayoffGames;
}
export class LoadDivisionPlayoffGamesSuccess implements Action {
  readonly type = GameActionTypes.LoadDivisionPlayoffGamesSuccess;
  constructor (public payload: PlayoffGame[]) { }
}
export class LoadDivisionPlayoffGamesFail implements Action {
  readonly type = GameActionTypes.LoadDivisionPlayoffGamesFail;

  constructor (public payload: string) { }
}

export class SetPlayoffGames implements Action {
  readonly type = GameActionTypes.SetPlayoffGames;
  constructor (public payload: PlayoffGame[]) { }
}

export class LoadDivisionsFail implements Action {
  readonly type = GameActionTypes.LoadDivisionsFail;

  constructor (public payload: string) { }
}
export class LoadTeams implements Action {
  readonly type = GameActionTypes.LoadTeams;
}
export class LoadTeamsSuccess implements Action {
  readonly type = GameActionTypes.LoadTeamsSuccess;
  constructor (public payload: Team[]) { }
}
export class LoadTeamsFail implements Action {
  readonly type = GameActionTypes.LoadTeamsFail;
  constructor (public payload: string) { }
}

export class LoadFilteredTeams implements Action {
  readonly type = GameActionTypes.LoadFilteredTeams;
}

export class LoadFilteredTeamsSuccess implements Action {
  readonly type = GameActionTypes.LoadFilteredTeamsSuccess;
  constructor (public payload: Team[]) { }
}

export class LoadFilteredTeamsFail implements Action {
  readonly type = GameActionTypes.LoadFilteredTeamsFail;

  constructor (public payload: string) { }
}

export class SetCanEdit implements Action {
  readonly type = GameActionTypes.SetCanEdit;
  constructor (public payload: boolean) { }
}
export class SetCurrentGame implements Action {
  readonly type = GameActionTypes.SetCurrentGame;
  constructor (public payload: RegularGame) { }
}

export type GameActions =
  | ToggleActionList
  | LoadCurrentSeason
  | LoadCurrentSeasonSuccess
  | LoadCurrentSeasonFail
  | SetCurrentSeason
  | SetCurrentDivision
  | SetCurrentDivisionId
  | SetCurrentTeam
  | ClearCurrentGame
  | InitializeCurrentGame
  | SetGames
  | SetDivisions
  | SetTeams
  | SetAllTeams
  | LoadGames
  | LoadGamesSuccess
  | LoadGamesFail
  | LoadFilteredGames
  | LoadFilteredGamesSuccess
  | LoadFilteredGamesFail
  | LoadFilteredGamesByTeam
  | LoadFilteredGamesByTeamSuccess
  | LoadFilteredGamesByTeamFail
  | LoadStandings
  | LoadStandingsSuccess
  | LoadStandingsFail
  | LoadPlayoffGames
  | LoadPlayoffGamesSuccess
  | LoadPlayoffGamesFail
  | LoadDivisionPlayoffGames
  | LoadDivisionPlayoffGamesSuccess
  | LoadDivisionPlayoffGamesFail
  | SetPlayoffGames
  | LoadDivisions
  | LoadDivisionsSuccess
  | LoadDivisionsFail
  | LoadTeams
  | LoadTeamsSuccess
  | LoadTeamsFail
  | LoadFilteredTeams
  | LoadFilteredTeamsSuccess
  | LoadFilteredTeamsFail
  | SetCanEdit
  | SetCurrentGame;
