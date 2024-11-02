
export class Season  {
    public seasonId: number | undefined;
    public description: string | undefined;
    public fromDate?: Date;
    public toDate?: Date;
    public participationFee?: number;
    public sponsorFee?: number;
    public sponsorDiscount?: number;
    public onlineStarts?: Date;
    public onlineStops?: Date;
    public currentSeason!: boolean;
    public currentSchedule!: boolean;
    public currentSignUps!: boolean;
    public gameSchedules!: boolean;
    public onlineRegistration!: boolean;

    constructor() { }
}

