import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Game } from '../../domain/game';
import { GameActions, GameActionTypes } from './games.actions';
import { Division } from '@app/domain/division';
import { Team } from '@app/domain/team';
import { Season } from '@app/domain/season';
import { Standing } from '@app/domain/standing';
import { PlayoffGame } from '@app/domain/playoffGame';

export interface GameState {
  currentSeason: Season | null;
  currentSeasonId: number;
  currentDivisionId: number | undefined;
  currentDivision: Division | undefined;
  currentTeamId: number | undefined;
  currentTeam: Team | undefined;
  games: Game[];
  playoffGames: PlayoffGame[];
  filteredGames: Game[];
  filteredTeams: Team[];
  filteredPlayoffGames: PlayoffGame[];
  standings: Standing[];
  showListView: boolean;
  divisions: Division[];
  teams: Team[];
  showAllteams: boolean;
  canEdit: boolean;
  currentGame: Game;
}

const cd = 0,
  initialState: GameState = {
    showListView: true,
    currentSeasonId: 0,
    currentSeason: {
      seasonId: 0,
      description: 'Summer Season',
      currentSeason: true,
      currentSchedule: true,
      gameSchedules: true,
      onlineRegistration: false,
    },
    currentDivisionId: 0,
    currentDivision: new Division(0, 0, '', new Date(), new Date()),
    currentTeamId: 0,
    currentTeam: new Team(),
    games: [],
    playoffGames: [],
    standings: [],
    filteredGames: [],
    filteredTeams: [],
    filteredPlayoffGames: [],
    divisions: [],
    teams: [],
    showAllteams: true,
    canEdit: false,
    currentGame: new Game(0, 0, 0, 0),
  };

export function reducer(state = initialState, action: GameActions): GameState {
  switch (action.type) {
    case GameActionTypes.SetCurrentSeason:
      return {
        ...state,
        currentSeason: action.payload,
      };
    case GameActionTypes.SetCurrentDivision:
      return {
        ...state,
        currentDivision: action.payload,
      };
    case GameActionTypes.SetCurrentDivisionId:
      return {
        ...state,
        currentDivisionId: action.payload,
      };

    case GameActionTypes.SetCurrentTeam:
      return {
        ...state,
        currentTeam: action.payload,
      };
    case GameActionTypes.SetGames:
      return {
        ...state,
        games: action.payload,
      };
    case GameActionTypes.SetDivisions:
      return {
        ...state,
        divisions: action.payload,
      };
    case GameActionTypes.SetTeams:
      return {
        ...state,
        teams: action.payload,
      };
    case GameActionTypes.SetAllTeams:
      return {
        ...state,
        showAllteams: action.payload,
      };
    case GameActionTypes.LoadDivisionsSuccess:
      return {
        ...state,
        divisions: action.payload,
      };
    case GameActionTypes.LoadTeamsSuccess:
      return {
        ...state,
        teams: action.payload,
      };
    case GameActionTypes.LoadSuccess:
      return {
        ...state,
        games: action.payload,
      };
    case GameActionTypes.LoadPlayoffGamesSuccess:
      return {
        ...state,
        playoffGames: action.payload,
      };
    case GameActionTypes.LoadFilteredGamesSuccess:
      return {
        ...state,
        filteredGames: action.payload,
      };
    case GameActionTypes.LoadFilteredGamesByTeamSuccess:
      return {
        ...state,
        filteredGames: action.payload,
      };
    case GameActionTypes.LoadFilteredTeamsSuccess:
      return {
        ...state,
        filteredTeams: action.payload,
      };
    case GameActionTypes.LoadStandingsSuccess:
      return {
        ...state,
        standings: action.payload,
      };
    case GameActionTypes.SetCanEdit:
      return {
        ...state,
        canEdit: action.payload,
      };
    case GameActionTypes.SetCurrentGame:
      return {
        ...state,
        currentGame: action.payload,
      };
    case GameActionTypes.SetPlayoffGames:
      return {
        ...state,
        playoffGames: action.payload,
      };
    default: {
      return state;
    }
  }
}
