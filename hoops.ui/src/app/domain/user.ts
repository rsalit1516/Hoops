import { Division } from './division';

/* Defines the user entity */
export class User {
    userId!: number;
    userName!: string;
    isAdmin!: boolean;
    firstName: string | undefined;
    lastName: string | undefined
    houseId: number | undefined;
    peopleId?: number | undefined;
    userType: number | undefined;
    screens: string[] | undefined;
    divisions: Division[] | undefined;

    constructor(_userId: number, _userName: string, _isAdmin: boolean) {
        this.userId = _userId;
        this.userName = _userName;
        this.isAdmin = _isAdmin;
    }
}
