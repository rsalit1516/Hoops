import { Season }  from './season';

export class Game {
    gameScheduleId: number;
     public seasonId: number;
        public divisionID: number;
        public gameId: number;
        public location: string;
        public gameDate: Date;
        public gameTime: Date;
        public homeTeamName: string;
        public homeTeamId: number;
        public visitingTeamName: string;
        public visitingTeamId: number;
        public homeTeamScore: number;
        public visitingTeamScore: number;
    constructor() { }
}
