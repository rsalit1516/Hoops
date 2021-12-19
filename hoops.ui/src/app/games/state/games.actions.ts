import { Game } from "../../domain/game";
import * as fromGames from "./index";

/* NgRx */
import { Action, Store } from "@ngrx/store";
import { Division } from "app/domain/division";
import { Team } from "app/domain/team";
import { Season } from "app/domain/season";
import { Standing } from "app/domain/standing";
import { PlayoffGame } from "app/domain/playoffGame";

export enum GameActionTypes {
  ToggleGameCode = "[Game] Toggle Game Code",
  LoadCurrentSeason = "[Games] Load Current Season",
  SetCurrentSeason = "[Games] Set Current Season",
  SetCurrentDivision = "[Game] Set Current Division",
  SetCurrentDivisionId = "[Game] Set Current DivisionId",
  SetCurrentTeam = "[Game] Set Current Team",
  ClearCurrentGame = "[Game] Clear Current Game",
  SetGames = "[Games] Set Games",
  SetPlayoffGames = "[Games] Set Playoff Games",
  SetDivisions = "[Games] Set Divisions",
  SetTeams = "[Games] Set Teams",
  SetAllTeams = "[Games] Set AllTeams",
  InitializeCurrentGame = "[Game] Initialize Current Game",
  Load = "[Game] All Games Load",
  LoadSuccess = "[Game] Load All Games Success",
  LoadFail = "[Game] Load All Games Fail",
  LoadFilteredGames = "[Game] Load Filtered Games",
  LoadFilteredGamesSuccess = "[Game] Load Filtered Game Success",
  LoadFilteredGamesFail = "[Game] Load Filtered Games Fail",
  LoadFilteredGamesByTeam = "[Game] Load Filtered Games by Team",
  LoadFilteredGamesByTeamSuccess = "[Game] Load Filtered Game by Team Success",
  LoadFilteredGamesByTeamFail = "[Game] Load Filtered Games by Team Fail",
  LoadStandings = "[Game] Load Standings",
  LoadStandingsSuccess = "[Game] Load Standings Success",
  LoadStandingsFail = "[Game] Load Standings Fail",
  LoadDivisions = "[Game] Load Divisions",
  LoadDivisionsSuccess = "[Game] Load Divisions Success",
  LoadDivisionsFail = "[Game] Load Divisions Fail",
  LoadTeams = "[Game] Load Teams",
  LoadTeamsSuccess = "[Game] Load Teams Success",
  LoadTeamsFail = "[Game] Load Teams Fail",
  LoadFilteredTeams = "[Game] Load Filtered Teams",
  LoadFilteredTeamsSuccess = "[Game] Load Filtered Teams Success",
  LoadFilteredTeamsFail = "[Game] Load Filtered Teams Fail",
  SetCanEdit = "[Game] Set Can Edit Scores",
  SetCurrentGame = "[Game] Set Current Game",
  LoadPlayoffGames = "[Game] Load Playoff Games",
  LoadPlayoffGamesSuccess = "[Game] Load Playoff Games Success",
  LoadPlayoffGamesFail = "[Game] Load Playoff Games Fail",
}

// Action Creators
export class ToggleActionList implements Action {
  readonly type = GameActionTypes.ToggleGameCode;
  constructor(public pay: boolean) {}
}
export class LoadCurrentSeason implements Action {
  readonly type = GameActionTypes.LoadCurrentSeason;
}
export class SetCurrentSeason implements Action {
  readonly type = GameActionTypes.SetCurrentSeason;
  constructor(public payload: Season | null) {
    // console.log(payload);
  }
}
export class SetCurrentDivision implements Action {
  readonly type = GameActionTypes.SetCurrentDivision;
  constructor(public payload: Division) {
    // console.log(payload);
  }
}

export class SetCurrentDivisionId implements Action {
  readonly type = GameActionTypes.SetCurrentDivisionId;
  constructor(public payload: number) {
    // console.log(payload);
  }
}

export class SetCurrentTeam implements Action {
  readonly type = GameActionTypes.SetCurrentTeam;
  constructor(public payload: Team) {}
}

export class ClearCurrentGame implements Action {
  readonly type = GameActionTypes.ClearCurrentGame;
}

export class InitializeCurrentGame implements Action {
  readonly type = GameActionTypes.InitializeCurrentGame;
}

export class SetGames implements Action {
  readonly type = GameActionTypes.SetGames;
  constructor(public payload: Game[]) {}
}
export class SetDivisions implements Action {
  readonly type = GameActionTypes.SetDivisions;
  constructor(public payload: Division[]) {}
}

export class SetTeams implements Action {
  readonly type = GameActionTypes.SetTeams;
  constructor(public payload: Team[]) {}
}
export class SetAllTeams implements Action {
  readonly type = GameActionTypes.SetAllTeams;
  constructor(public payload: boolean) {}
}

export class Load implements Action {
  readonly type = GameActionTypes.Load;
}

export class LoadSuccess implements Action {
  readonly type = GameActionTypes.LoadSuccess;
  constructor(public payload: Game[]) {}
}

export class LoadFail implements Action {
  readonly type = GameActionTypes.LoadFail;

  constructor(public payload: string) {}
}
export class LoadFilteredGames implements Action {
  readonly type = GameActionTypes.LoadFilteredGames;
}

export class LoadFilteredGamesSuccess implements Action {
  readonly type = GameActionTypes.LoadFilteredGamesSuccess;
  constructor(public payload: Game[]) {}
}

export class LoadFilteredGamesFail implements Action {
  readonly type = GameActionTypes.LoadFilteredGamesFail;

  constructor(public payload: string) {}
}

export class LoadFilteredGamesByTeam implements Action {
  readonly type = GameActionTypes.LoadFilteredGamesByTeam;
}

export class LoadFilteredGamesByTeamSuccess implements Action {
  readonly type = GameActionTypes.LoadFilteredGamesByTeamSuccess;
  constructor(public payload: Game[]) {}
}

export class LoadFilteredGamesByTeamFail implements Action {
  readonly type = GameActionTypes.LoadFilteredGamesByTeamFail;

  constructor(public payload: string) {}
}
export class LoadStandings implements Action {
  readonly type = GameActionTypes.LoadStandings;
}

export class LoadStandingsSuccess implements Action {
  readonly type = GameActionTypes.LoadStandingsSuccess;
  constructor(public payload: Standing[]) {}
}

export class LoadStandingsFail implements Action {
  readonly type = GameActionTypes.LoadStandingsFail;

  constructor(public payload: string) {}
}
export class LoadDivisions implements Action {
  readonly type = GameActionTypes.LoadDivisions;
}
export class LoadDivisionsSuccess implements Action {
  readonly type = GameActionTypes.LoadDivisionsSuccess;

  constructor(public payload: Division[]) {
    // console.log(payload);
    // this.store.dispatch(
    //   new SetCurrentDivision(payload[0])
    // );
  }
}
export class LoadPlayoffGames implements Action {
  readonly type = GameActionTypes.LoadPlayoffGames;
}
export class LoadPlayoffGamesSuccess implements Action {
  readonly type = GameActionTypes.LoadPlayoffGamesSuccess;

  constructor(public payload: PlayoffGame[]) {}
}
export class LoadPlayoffGamesFail implements Action {
  readonly type = GameActionTypes.LoadPlayoffGamesFail;

  constructor(public payload: string) {}
}

export class SetPlayoffGames implements Action {
  readonly type = GameActionTypes.SetPlayoffGames;
  constructor(public payload: PlayoffGame[]) {}
}

export class LoadDivisionsFail implements Action {
  readonly type = GameActionTypes.LoadDivisionsFail;

  constructor(public payload: string) {}
}
export class LoadTeams implements Action {
  readonly type = GameActionTypes.LoadTeams;
}
export class LoadTeamsSuccess implements Action {
  readonly type = GameActionTypes.LoadTeamsSuccess;
  constructor(public payload: Team[]) {}
}
export class LoadTeamsFail implements Action {
  readonly type = GameActionTypes.LoadTeamsFail;
  constructor(public payload: string) {}
}

export class LoadFilteredTeams implements Action {
  readonly type = GameActionTypes.LoadFilteredTeams;
}

export class LoadFilteredTeamsSuccess implements Action {
  readonly type = GameActionTypes.LoadFilteredTeamsSuccess;
  constructor(public payload: Team[]) {}
}

export class LoadFilteredTeamsFail implements Action {
  readonly type = GameActionTypes.LoadFilteredTeamsFail;

  constructor(public payload: string) {}
}

export class SetCanEdit implements Action {
  readonly type = GameActionTypes.SetCanEdit;
  constructor(public payload: boolean) {}
}
export class SetCurrentGame implements Action {
  readonly type = GameActionTypes.SetCurrentGame;
  constructor(public payload: Game) {}
}

export type GameActions =
  | ToggleActionList
  | LoadCurrentSeason
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
  | Load
  | LoadSuccess
  | LoadFail
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
