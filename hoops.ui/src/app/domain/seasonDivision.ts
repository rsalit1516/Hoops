module app.domain {

    export interface ISeasonDivision {
        seasonId: number;
        divisionName: string;
        startDate: Date;
        endDate: Date;
        teams: number;
        players: number;
    }

    export class SeasonDivision implements ISeasonDivision {
        constructor(
            public seasonId: number,
            public divisionName: string,
            public startDate: Date,
            public endDate: Date,
            public teams: number,
            public players: number) {
        }
    }
}