import { DateTime } from 'luxon';

export class Person {
  public personId!: number;
  public companyId: number = 1;
  public firstName: string = '';
  public lastName: string = '';
  public houseId: number = 0;
  public email: string = '';
  public cellphone: string = '';
  public workphone: string = '';
  public birthDate: Date = new Date();
  public gender: string = '';
  public suspended: boolean = false;
  public latestSeason: string = '';
  public latestShirtSize: string = '';
  public latestRating: number = 0;
  public bc: boolean = true;
  public schoolName: string = '';
  public grade: number = 0;
  public giftedLevelsUp: number = 0;
  public feeWaived: boolean = false;
  public player: boolean = true;
  public parent: boolean = false;
  public coach: boolean = false;
  public asstCoach: boolean = false;
  public boardOfficer: boolean = false;
  public boardMember: boolean = false;
  public ad: boolean = false;
  public sponsor: boolean = false;
  public signUps: boolean = false;
  public tryOuts: boolean = false;
  public teeShirts: boolean = false;
  public printing: boolean = false;
  public equipment: boolean = false;
  public electrician: boolean = false;
  public comments: string = '';
  public createdDate: Date = new Date();
  public createdUser: string = '';
  public tempId: number = 0;
  // public  household: null
}
