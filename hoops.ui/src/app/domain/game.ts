import { Season } from './season';

export class Game {
    public gameScheduleId!: number;
    public gameDescription!: string;
    public seasonId!: number;
    public divisionId!: number;
    public divisionDescription: string | undefined;
    public gameId: number | undefined;
    public locationName!: string;
    public locationNumber!: number;
    public gameDate: Date | undefined;
    public gameTime: Date | undefined;
    public homeTeamName: string | undefined;
    public homeTeamId!: number;
    public homeTeamNumber!: number;
    public homeTeamScore: number | undefined;
    public visitingTeamName: string | undefined;
    public visitingTeamId: number | undefined;
    public visitingTeamNumber: number | undefined;
    public visitingTeamScore: number | undefined;
    public scheduleGamesId!: number;
    public scheduleNumber!: number;
    public companyId: string| undefined;
    public gameTimeString: string | undefined;
    public gameNumber: number| undefined;
    constructor(gameScheduleId: number,
        seasonId: number,
        divisionId: number,
        gameId: number) {
        gameScheduleId = gameScheduleId,
            seasonId = seasonId,
            divisionId = divisionId,
            gameId = gameId
    }
}


// visitingTeamSeasonNumber":0,"homeTeamSeasonNumber":0,"visitingTeamName":"5P","homeTeamName":"4P","scheduleNumber":75,"homeTeamScore":0,"visitingTeamScore":0,"gameDescription":"PLAYOFF A","visitingTeamId":0,
// "homeTeamId":0},
