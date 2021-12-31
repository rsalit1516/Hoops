export class Director {
    id!: number;
    companyId!: number;
    peopleId!: number;
    seq!: number;
    title!: string;
    lastName!: string;
    firstName!: string;
    photo: any | undefined;
    phonePref: boolean | undefined;
    emailPref: boolean | undefined;
    createdDate!: Date;
    createdUser: string | undefined;
    constructor(id: number,
      companyId: number,
      peopleId: number,
      lastName: string,
      firstName: string,
      seq: number,
      title: string,
      emailPref: boolean
      ) {

      }
}
