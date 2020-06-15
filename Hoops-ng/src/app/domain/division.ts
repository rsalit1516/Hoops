
export interface IDivision {
    seasonID: number;
    divisionID: number,
    div_Desc: string;
    // div_Desc: string;
    minDate: Date;
    maxDate: Date;
}

export class Division implements IDivision {
    constructor(
        public seasonID: number,
        public divisionID: number,
        // public divisionName: string,
       public div_Desc: string,
        public minDate: Date,
        public maxDate: Date) {
    }
}
