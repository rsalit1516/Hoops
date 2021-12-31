module app.domain {

    export interface ISponsor {
        sponsorId: number;
        active: boolean;
        name: string;
        website: string;
        phone: string;
    }

    export class Sponsor implements ISponsor {
        constructor(
            public sponsorId: number,
            public active: boolean,
            public name: string,
            public website: string,
            public phone: string) {
        }
    }
}