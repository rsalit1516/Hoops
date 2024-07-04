/* NgRx */
import { Action } from '@ngrx/store';
import { Division } from '@app/domain/division';
import { Team } from '@app/domain/team';
import { Season } from '@app/domain/season';
import { Game } from '@app/domain/game';
import { Color } from '@app/domain/color';
import { Location } from '@app/domain/location';
import { PlayoffGame } from '@app/domain/playoffGame';
import { WebContent } from '@app/domain/webContent';
import { Content } from '@app/domain/content';
import { WebContentType } from '@app/domain/webContentType';

export enum AdminActionTypes {
  LoadCurrentSeason = '[Admin] Load Current Season',
  SetCurrentSeason = '[Admin] Set Current Season',
  LoadGames = '[Admin] Load Games',
  LoadGamesSuccess = '[Admin] Load Games Success',
  LoadGamesFail = '[Admin] Load GamesFail',
  LoadDivisionGames = '[Admin] Load Division Games',
  LoadDivisionGamesSuccess = '[Admin] Load Division Games Success',
  LoadDivisionGamesFail = '[Admin] Load Division Games Fail',
  LoadTeamGames = '[Admin] Load Team Games',
  LoadTeamGamesSuccess = '[Admin] Load Team Games Success',
  LoadTeamGamesFail = '[Admin] Load Team Games Fail',
  SetFilteredGames = '[Admin] Set Filtered Games',
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
  SetLocations = '[Admin] Set Locations',
  SetGameType = '[Admin] Set Game Type',
  SetShowOnlyActiveWebContent = '[Admin] Set Show Only Active Web Content',
  LoadPlayoffGames = '[Game] Load Playoff Games',
  LoadPlayoffGamesSuccess = '[Game] Load Playoff Games Success',
  LoadPlayoffGamesFail = '[Game] Load Playoff Games Fail',
  LoadAdminContent = '[Content] Load Admin Content',
  LoadAdminContentSuccess = '[Content] Load Success',
  LoadAdminContentFail = '[Content] Load Fail',
  SetSelectedContent = '[Content] Set Selected Content',
  SetClonedContent = '[Content] Clone Selected Content',
  SetAllContent = '[Content] Set all content',
  SetAllContentSuccess = '[Content] Set all content success',
  SetAllContentFail = '[Content] Set all content faile',
  SetActiveContent = '[Content] Set only active content',
  SetActiveContentSuccess = '[Content] Set only active content success',
  SetActiveContentFail = '[Content] Set only active content fail',
  SetIsActiveOnly = '[Content] Set Is Active Content Only',
  LoadContentTypeList = '[Content] Load Content Type List',
  LoadContentTypeListSuccess = '[Content] Load Content Type List Success',
  LoadContentTypeListFail = '[Content] Load Content Type List Fail',
  LoadLocations = '[Location] Load Locations',
  LoadLocationsSuccess = '[Location] Load Locations Success',
  LoadLocationsFail = '[Location] Load Location Fail',

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
export class LoadDivisionGames implements Action {
  readonly type = AdminActionTypes.LoadDivisionGames;
}
export class LoadDivisionGamesSuccess implements Action {
  readonly type = AdminActionTypes.LoadDivisionGamesSuccess;
  constructor(public payload: Game[]) {}
}
export class LoadDivisionGamesFail implements Action {
  readonly type = AdminActionTypes.LoadDivisionGamesFail;
  constructor(public payload: string) {}
}
export class LoadTeamGames implements Action {
  readonly type = AdminActionTypes.LoadTeamGames;
}
export class LoadTeamGamesSuccess implements Action {
  readonly type = AdminActionTypes.LoadTeamGamesSuccess;
  constructor(public payload: Game[]) {}
}
export class LoadTeamGamesFail implements Action {
  readonly type = AdminActionTypes.LoadTeamGamesFail;
  constructor(public payload: string) {}
}

export class SetFilteredGames implements Action {
  readonly type = AdminActionTypes.SetFilteredGames;
  constructor(public payload: Game[]) {}
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
  constructor(public payload: Season) {}
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
  constructor(public payload: Team[]) {}
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
  constructor(public payload: Team[]) {}
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

export class SetLocations implements Action {
  readonly type = AdminActionTypes.SetLocations;
  constructor(public payload: Location[]) {}
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
export class LoadAdminContent implements Action {
  readonly type = AdminActionTypes.LoadAdminContent;
}
export class LoadAdminContentSuccess implements Action {
  readonly type = AdminActionTypes.LoadAdminContentSuccess;
  constructor(public payload: WebContent[]) {}
}
export class LoadAdminContentFail implements Action {
  readonly type = AdminActionTypes.LoadAdminContentFail;
  constructor(public payload: string) {}
}

export class SetAllContent implements Action {
  readonly type = AdminActionTypes.SetAllContent;
}
export class SetAllContentSuccess implements Action {
  readonly type = AdminActionTypes.SetAllContentSuccess;
  constructor(public payload: WebContent[]) {}
}
export class SetAllContentFail implements Action {
  readonly type = AdminActionTypes.SetAllContentFail;
  constructor(public payload: String) {}
}

export class SetActiveContent implements Action {
  readonly type = AdminActionTypes.SetActiveContent;
}
export class SetActiveContentSuccess implements Action {
  readonly type = AdminActionTypes.SetActiveContentSuccess;
  constructor(public payload: WebContent[]) {}
}
export class SetActiveContentFail implements Action {
  readonly type = AdminActionTypes.SetActiveContentFail;
  constructor(public payload: String) {}
}

export class SetClonedContent implements Action {
  readonly type = AdminActionTypes.SetClonedContent;
  constructor(public payload: Content) {}
}
export class SetSelectedContent implements Action {
  readonly type = AdminActionTypes.SetSelectedContent;
  constructor(public payload: Content) {}
}
export class SetIsActiveOnly implements Action {
  readonly type = AdminActionTypes.SetIsActiveOnly;
  constructor(public payload: boolean) {}
}
export class LoadContentTypeList implements Action {
  readonly type = AdminActionTypes.LoadContentTypeList;
}
export class LoadContentTypeListSuccess implements Action {
  readonly type = AdminActionTypes.LoadContentTypeListSuccess;
  constructor(public payload: WebContentType[]) {}
}
export class LoadContentTypeListFail implements Action {
  readonly type = AdminActionTypes.LoadContentTypeListFail;
  constructor(public payload: string) {}
}

export class LoadLocations implements Action {
  readonly type = AdminActionTypes.LoadLocations;
}
export class LoadLocationsSuccess implements Action {
  readonly type = AdminActionTypes.LoadLocationsSuccess;
  constructor(public payload: Location[]) {}
}
export class LoadLocationsFail implements Action {
  readonly type = AdminActionTypes.LoadLocationsFail;
  constructor(public payload: string) {}
}

export type AdminActions =
  | LoadCurrentSeason
  | SetCurrentSeason
  | LoadGames
  | LoadGamesSuccess
  | LoadGamesFail
  | LoadDivisionGames
  | LoadDivisionGamesSuccess
  | LoadDivisionGamesFail
  | LoadTeamGames
  | LoadTeamGamesSuccess
  | LoadTeamGamesFail
  | SetFilteredGames
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
  | SetLocations
  | SetGameType
  | SetShowOnlyActiveWebContent
  | LoadPlayoffGames
  | LoadPlayoffGamesSuccess
  | LoadPlayoffGamesFail
  | LoadAdminContent
  | LoadAdminContentSuccess
  | LoadAdminContentFail
  | SetSelectedContent
  | SetClonedContent
  | SetAllContent
  | SetAllContentSuccess
  | SetAllContentFail
  | SetActiveContent
  | SetActiveContentSuccess
  | SetActiveContentFail
  | SetIsActiveOnly
  | LoadContentTypeList
  | LoadContentTypeListSuccess
  | LoadContentTypeListFail
  | LoadLocations
  | LoadLocationsSuccess
  | LoadLocationsFail

