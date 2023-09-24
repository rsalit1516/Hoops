import { Season } from './season';

export class PlayoffGame {
  public scheduleNumber!: number;
  public gameNumber!: number;
  public descr: string | undefined;
  public divisionId: number | undefined;
  public gameId: number | undefined;
  public locationNumber: number | undefined;
  public gameDate: Date | undefined;
  public gameTime: Date | undefined;
  public homeTeam: string | undefined;
  public visitingTeam: string | undefined;
  public homeTeamScore: number | undefined;
  public visitingTeamScore: number | undefined;
  // public Description: string;
  constructor() {}
}
