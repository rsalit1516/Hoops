module app.domain {
    export interface IContact {
        contactId: number,
        firstName: string,
        lastName: string,
        title: string,
        cellPhone: string,
        email: string
    }

    export class Contact implements IContact {
        constructor(
            public contactId: number,
            public firstName: string,
            public lastName: string,
            public title: string,
            public cellPhone: string,
            public email: string) {

        }
    }
}