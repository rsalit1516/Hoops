
export interface IDivision {
    seasonId: number;
    divisionId: number;
    divisionDescription: string;
    // div_Desc: string;
    minDate: Date;
    maxDate: Date;
}

export class Division implements IDivision {
    constructor(
        public seasonId: number,
        public divisionId: number,
        // public divisionName: string,
       public divisionDescription: string,
        public minDate: Date,
        public maxDate: Date) {
    }
}
