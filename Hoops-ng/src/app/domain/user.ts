import { Division } from './division';

/* Defines the user entity */
export interface User {
    userId: number;
    userName: string;
    isAdmin: boolean;
    firstName: string;
    lastName: string
    houseId: number;
    peopleId?: number;
    userType: number;
    screens: string[];
    divisions: Division[];
}
