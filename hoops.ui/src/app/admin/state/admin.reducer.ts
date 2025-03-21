import { AdminActions, AdminActionTypes } from './admin.actions';
// import * as fromRoot from '../../state/app.state';
import { Season } from '@app/domain/season';
import { Division } from '@app/domain/division';
import { RegularGame } from '@app/domain/regularGame';
import { Team } from '@app/domain/team';
import { Color } from '@app/domain/color';
import { Location } from '@app/domain/location';
import { PlayoffGame } from '@app/domain/playoffGame';
import { Content } from '@app/domain/content';
import { WebContent } from '@app/domain/webContent';
import { WebContentType } from '@app/domain/webContentType';

export interface AdminState {
  divisionGames: RegularGame[] | null;
  teamGames: RegularGame[] | null;
  selectedSeason: Season;
  selectedDivision: Division | null;
  currentTeamId: number | null;
  games: RegularGame[];
  filteredGames: RegularGame[];
  seasons: Season[];
  divisions: Division[];
  divisionTeams: Team[];
  seasonDivisions: Division[];
  selectedGame: RegularGame | null;
  seasonTeams: Team[] | null;
  selectedTeam: Team | null;
  colors: Color[];
  locations: Location[];
  showOnlyActiveWebContent: boolean;
  gameType: string;
  playoffGames: PlayoffGame[];
  currentContentId: number | null;
  selectedContent: Content | null;
  contentList: WebContent[];
  isActiveOnly: boolean;
  filteredList: WebContent[];
  contentTypeList: WebContentType[];
  clonedContent: Content;
}

const initialState: AdminState = {
  selectedSeason: new Season(),
  selectedDivision: null,
  currentTeamId: null,
  games: [],
  filteredGames: [],
  divisionGames: [],
  teamGames: [],
  seasons: [],
  divisions: [],
  divisionTeams: [],
  seasonDivisions: [],
  selectedGame: null,
  seasonTeams: [],
  selectedTeam: null,
  colors: [],
  locations: [],
  showOnlyActiveWebContent: true,
  gameType: 'Regular Season',
  playoffGames: [],
  currentContentId: null,
  selectedContent: null,
  contentList: [],
  isActiveOnly: true,
  filteredList: [],
  contentTypeList: [],
  clonedContent: new Content(),
};

export function reducer (
  state = initialState,
  action: AdminActions
): AdminState {
  switch (action.type) {
    case AdminActionTypes.LoadSeasonsSuccess:
      return {
        ...state,
        seasons: action.payload,
      };

    case AdminActionTypes.SetSelectedDivision:
      return {
        ...state,
        selectedDivision: action.payload,
      };
    case AdminActionTypes.SetSelectedSeason:
      return {
        ...state,
        selectedSeason: action.payload,
      };
    case AdminActionTypes.SetSelectedGame:
      return {
        ...state,
        selectedGame: action.payload,
      };
    case AdminActionTypes.LoadGamesSuccess:
      return {
        ...state,
        games: action.payload,
      };
    case AdminActionTypes.LoadDivisionGamesSuccess:
      return {
        ...state,
        divisionGames: action.payload,
      };
    case AdminActionTypes.LoadTeamGamesSuccess:
      return {
        ...state,
        teamGames: action.payload,
      };
    case AdminActionTypes.SetFilteredGames:
      return {
        ...state,
        filteredGames: action.payload,
      };
    case AdminActionTypes.LoadDivisionsSuccess:
      return {
        ...state,
        seasonDivisions: action.payload,
      };
    case AdminActionTypes.LoadDivisionTeamsSuccess:
      return {
        ...state,
        divisionTeams: action.payload,
      };
    case AdminActionTypes.SetSelectedTeam:
      return {
        ...state,
        selectedTeam: action.payload,
      };
    case AdminActionTypes.SetColors:
      return {
        ...state,
        colors: action.payload,
      };
    case AdminActionTypes.LoadSeasonTeamsSuccess:
      return {
        ...state,
        seasonTeams: action.payload,
      };
    case AdminActionTypes.SetGameType:
      return {
        ...state,
        gameType: action.payload,
      };
    case AdminActionTypes.SetSelectedContent:
      return {
        ...state,
        selectedContent: action.payload,
      };
    case AdminActionTypes.SetAllContentSuccess:
      return {
        ...state,
        filteredList: action.payload,
      };
    case AdminActionTypes.SetIsActiveOnly:
      return {
        ...state,
        isActiveOnly: action.payload,
      };
    case AdminActionTypes.LoadAdminContentSuccess:
      return {
        ...state,
        contentList: action.payload,
      };
    case AdminActionTypes.SetActiveContentSuccess:
      return {
        ...state,
        filteredList: action.payload,
      };
    case AdminActionTypes.SetClonedContent:
      return {
        ...state,
        clonedContent: action.payload,
      };
    case AdminActionTypes.LoadContentTypeListSuccess:
      return {
        ...state,
        contentTypeList: action.payload,
      };
    case AdminActionTypes.LoadLocationsSuccess:
      return {
        ...state,
        locations: action.payload,
      };

    default: {
      return state;
    }
  }
}
