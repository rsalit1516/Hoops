import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Game } from '../../domain/game';
import { GameActions, GameActionTypes } from './games.actions';
import * as fromRoot from '../../state/app.state';
import { Division } from 'app/domain/division';
import { Team } from 'app/domain/team';
import { Season } from 'app/domain/season';
import { Standing } from 'app/domain/standing';

export interface GameState {
  currentSeason: Season;
  currentSeasonId: number;
  currentDivisionId: number | null;
  currentDivision: Division | null;
  currentTeamId: number | null;
  currentTeam: Team | null;
  games: Game[];
  filteredGames: Game[];
  standings: Standing[];
  showListView: boolean;
  divisions: Division[];
  teams: Team[];
  showAllteams: boolean;
  canEdit: boolean;
  currentGame: Game;
}

const initialState: GameState = {
  showListView: true,
  currentSeasonId: null,
  currentSeason: {
    seasonID: null,
    description: 'Summer Season',
    currentSeason: true,
    currentSchedule: true,
    gameSchedules: true,
    onlineRegistration: false
  },
  currentDivisionId: null,
  currentDivision: null,
  currentTeamId: null,
  currentTeam: null,
  games: [],
  standings: [],
  filteredGames: [],
  divisions: [],
  teams: [],
  showAllteams: true,
  canEdit: false,
  currentGame: null
};

export function reducer(state = initialState, action: GameActions): GameState {
  switch (action.type) {
    case GameActionTypes.SetCurrentSeason:
      return {
        ...state,
        currentSeason: action.payload
      };
    case GameActionTypes.SetCurrentDivision:
      return {
        ...state,
        currentDivision: action.payload
      };
    case GameActionTypes.SetCurrentTeam:
      return {
        ...state,
        currentTeam: action.payload
      };
    case GameActionTypes.SetGames:
      return {
        ...state,
        games: action.payload
      };
    case GameActionTypes.SetDivisions:
      return {
        ...state,
        divisions: action.payload
      };
    case GameActionTypes.SetTeams:
      return {
        ...state,
        teams: action.payload
      };
    case GameActionTypes.SetAllTeams:
      return {
        ...state,
        showAllteams: action.payload
      };
    case GameActionTypes.LoadDivisionsSuccess:
      return {
        ...state,
        divisions: action.payload
      };
    case GameActionTypes.LoadTeamsSuccess:
      return {
        ...state,
        teams: action.payload
      };
    case GameActionTypes.LoadSuccess:
      return {
        ...state,
        games: action.payload
      };
    case GameActionTypes.LoadFilteredGamesSuccess:
      return {
        ...state,
        filteredGames: action.payload
      };
    case GameActionTypes.LoadStandingsSuccess:
      return {
        ...state,
        standings: action.payload
      };
    case GameActionTypes.SetCanEdit:
      return {
        ...state,
        canEdit: action.payload
      };
    case GameActionTypes.SetCurrentGame:
      return {
        ...state,
        currentGame: action.payload
      };

    default: {
      return state;
    }
  }
}
