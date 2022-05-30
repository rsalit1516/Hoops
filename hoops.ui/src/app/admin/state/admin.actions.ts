/* NgRx */
import { Action } from '@ngrx/store';
import { Division } from '@app/domain/division';
import { Team } from '@app/domain/team';
import { Season } from '@app/domain/season';
import { Game } from '@app/domain/game';
import { Color } from '@app/domain/color';
import { PlayoffGame } from '@app/domain/playoffGame';

export enum AdminActionTypes {
  LoadCurrentSeason = '[Admin] Load Current Season',
  SetCurrentSeason = '[Admin] Set Current Season',
  LoadGames = '[Admin] Load Games',
  LoadGamesSuccess = '[Admin] Load Games Success',
  LoadGamesFail = '[Admin] Load GamesFail',
  LoadFilteredGames = '[Admin] Load Filtered Games',
  LoadFilteredGamesSuccess = '[Admin] Load Filtered Games Success',
  LoadFilteredGamesFail = '[Admin] Load Filtered Games Fail',
  LoadSeasons = '[Admin] Load Seasons',
  LoadSeasonsSuccess = '[Admin] Load Seasons Success',
  LoadSeasonsFail = '[Admin] Load Seasons Fail',
  GetCurrentSeason = '[Admin] Get Current Season',
  SetSelectedSeason = '[Admin] Set Selected Season',
  SetSelectedSeasonId = '[Admin] Set Selected Season ID',
  LoadDivisions = '[Admin] Load All Season Divisions',
  LoadDivisionsSuccess = '[Admin] Load Divisions Success',
  LoadDivisionsFail = '[Admin] Load Divisions File',
  SetSelectedDivision = '[Admin] Set Selected Division',
  LoadSeasonTeams = '[Admin] Load Season Teams',
  LoadSeasonTeamsSuccess = '[Admin] Load Season Teams Success',
  LoadSeasonTeamsFail = '[Admin] Load Season Teams Fail',
  LoadDivisionTeams = '[Admin] Load Division Season Teams',
  LoadDivisionTeamsSuccess = '[Admin] Load Division Teams Success',
  LoadDivisionTeamsFail = '[Admin] Load Teams Fail',
  SetSelectedTeam = '[Admin] Set Selected Team',
  SetSelectedGame = '[Admin] Set SelectedGame',
  SetColors = '[Admin] Set Colors',
  SetGameType = '[Admin] Set Game Type',
  SetShowOnlyActiveWebContent =  '[Admin] Set Show Only Active Web Content',
  LoadPlayoffGames = "[Game] Load Playoff Games",
  LoadPlayoffGamesSuccess = "[Game] Load Playoff Games Success",
  LoadPlayoffGamesFail = "[Game] Load Playoff Games Fail",
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
export class LoadFilteredGames implements Action {
  readonly type = AdminActionTypes.LoadFilteredGames;
}
export class LoadFilteredGamesSuccess implements Action {
  readonly type = AdminActionTypes.LoadFilteredGamesSuccess;
  constructor(public payload: Game[]) {}
}
export class LoadFilteredGamesFail implements Action {
  readonly type = AdminActionTypes.LoadFilteredGamesFail;
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
// export class GetCurrentSeason implements Action {
//   readonly type = AdminActionTypes.GetCurrentSeason;
//   constructor(public payload: Season) {}
// }
export class SetSelectedSeason implements Action {
  readonly type = AdminActionTypes.SetSelectedSeason;
  constructor(public payload: Season) {
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
  constructor(public payload: Division[]) {}
}

export class LoadDivisionsFail implements Action {
  readonly type = AdminActionTypes.LoadDivisionsFail;
  constructor(public payload: string) {}
}
export class SetSelectedDivision implements Action {
  readonly type = AdminActionTypes.SetSelectedDivision;
  constructor(public payload: Division) {}
}

export class LoadSeasonTeams implements Action {
  readonly type = AdminActionTypes.LoadSeasonTeams;
}
export class LoadSeasonTeamsSuccess implements Action {
  readonly type = AdminActionTypes.LoadSeasonTeamsSuccess;
  constructor(public payload: Team[]) {
    console.log(payload);
  }
}

export class LoadSeasonTeamsFail implements Action {
  readonly type = AdminActionTypes.LoadSeasonTeamsFail;
  constructor(public payload: string) {}
}
export class LoadDivisionTeams implements Action {
  readonly type = AdminActionTypes.LoadDivisionTeams;
}
export class LoadDivisionTeamsSuccess implements Action {
  readonly type = AdminActionTypes.LoadDivisionTeamsSuccess;
  constructor(public payload: Team[]) {
    console.log(payload);
  }
}

export class LoadDivisionTeamsFail implements Action {
  readonly type = AdminActionTypes.LoadDivisionTeamsFail;
  constructor(public payload: string) {}
}
export class SetSelectedTeam implements Action {
  readonly type = AdminActionTypes.SetSelectedTeam;
  constructor(public payload: Team) {}
}

export class SetSelectedGame implements Action {
  readonly type = AdminActionTypes.SetSelectedGame;
  constructor(public payload: Game) {}
}

export class SetColors implements Action {
  readonly type = AdminActionTypes.SetColors;
  constructor(public payload: Color[]) {}
}

export class SetShowOnlyActiveWebContent implements Action {
  readonly type = AdminActionTypes.SetShowOnlyActiveWebContent;
  constructor(public payload: boolean) {}
}

export class SetGameType implements Action {
  readonly type = AdminActionTypes.SetGameType;
  constructor(public payload: string) {}
}
export class LoadPlayoffGames implements Action {
  readonly type = AdminActionTypes.LoadPlayoffGames;
}
export class LoadPlayoffGamesSuccess implements Action {
  readonly type = AdminActionTypes.LoadPlayoffGamesSuccess;

  constructor(public payload: PlayoffGame[]) {}
}
export class LoadPlayoffGamesFail implements Action {
  readonly type = AdminActionTypes.LoadPlayoffGamesFail;

  constructor(public payload: string) {}
}

export type AdminActions =
  | LoadCurrentSeason
  | SetCurrentSeason
  | LoadGames
  | LoadGamesSuccess
  | LoadGamesFail
  | LoadFilteredGames
  | LoadFilteredGamesSuccess
  | LoadFilteredGamesFail
  | LoadSeasons
  | LoadSeasonsSuccess
  | LoadSeasonsFail
  | SetSelectedSeason
  | SetSelectedSeasonId
  | LoadDivisions
  | LoadDivisionsSuccess
  | LoadDivisionsFail
  | SetSelectedDivision
  | LoadSeasonTeams
  | LoadSeasonTeamsSuccess
  | LoadSeasonTeamsFail
  | LoadDivisionTeams
  | LoadDivisionTeamsSuccess
  | LoadDivisionTeamsFail
  | SetSelectedTeam
  | SetSelectedGame
  | SetColors
| SetGameType
  | SetShowOnlyActiveWebContent
  | LoadPlayoffGames
  | LoadPlayoffGamesSuccess
  | LoadPlayoffGamesFail;
