import { AdminActions, AdminActionTypes } from './admin.actions';
// import * as fromRoot from '../../state/app.state';
import { Season } from '@app/domain/season';
import { Division } from '@app/domain/division';
import { Game } from '@app/domain/game';
import { Team } from '@app/domain/team';
import { Color } from '@app/domain/color';

export interface AdminState {
  selectedSeason: Season;
  selectedDivision: Division | null;
  currentTeamId: number | null;
  games: Game[];
  filteredGames: Game[];
  seasons: Season[];
  divisions: Division[];
  divisionTeams: Team[];
  seasonDivisions: Division[];
  selectedGame: Game | null;
  seasonTeams: Team[] | null;
  selectedTeam: Team | null;
  colors: Color[];
  showOnlyActiveWebContent: boolean;
}

const initialState: AdminState = {
  selectedSeason: new Season(),
  selectedDivision: null,
  currentTeamId: null,
  games: [],
  filteredGames: [],
  seasons: [],
  divisions: [],
  divisionTeams: [],
  seasonDivisions: [],
  selectedGame: null,
  seasonTeams: [],
  selectedTeam: null,
  colors: [],
  showOnlyActiveWebContent: true
};

export function reducer(
  state = initialState,
  action: AdminActions
): AdminState {
  switch (action.type) {
    case AdminActionTypes.LoadSeasonsSuccess:
      return {
        ...state,
        seasons: action.payload,
      };

    // case AdminActionTypes.SetCurrentSeason:
    //   return {
    //     ...state,
    //     currentSeason: action.payload,
    //   };
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
    case AdminActionTypes.LoadFilteredGamesSuccess:
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
    default: {
      return state;
    }
  }
}
