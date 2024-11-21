import { Season } from './season';

export class Game {
  public gameScheduleId!: number;
  public gameDescription!: string | null;
  public seasonId!: number;
  public divisionId!: number;
  public divisionDescription: string | undefined;
  public gameId: number | undefined;
  public locationName!: string;
  public locationNumber!: number;
  public gameDate!: Date;
  public gameTime: Date | undefined;
  public gameTimeString: string | undefined;
  public homeTeamName: string | undefined;
  public homeTeamId!: number;
  public homeTeamNumber!: number;
  public homeTeamScore: number | undefined;
  public homeTeamSeasonNumber: number | undefined;
  public visitingTeamName: string | undefined;
  public visitingTeamId: number | undefined;
  public visitingTeamNumber: number | undefined;
  public visitingTeamScore: number | undefined;
  public visitingTeamSeasonNumber: number | undefined
  public scheduleGamesId!: number;
  public scheduleNumber!: number;
  // public companyId: number | null = 1;
  public gameNumber: number | undefined;
  public gameType: number | null = 0;
  constructor(
    gameScheduleId: number,
    seasonId: number,
    divisionId: number,
    gameId: number
  ) {
    (gameScheduleId = gameScheduleId),
      (seasonId = seasonId),
      (divisionId = divisionId),
      (gameId = gameId);
  }
}

// visitingTeamSeasonNumber":0,"homeTeamSeasonNumber":0,"visitingTeamName":"5P","homeTeamName":"4P","scheduleNumber":75,"homeTeamScore":0,"visitingTeamScore":0,"gameDescription":"PLAYOFF A","visitingTeamId":0,
// "homeTeamId":0},
