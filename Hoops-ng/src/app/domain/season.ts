
export class Season  {
    public seasonID: number;
    public description: string;
    public fromDate?: Date;
    public toDate?: Date;
    public participationFee?: number;
    public sponsorFee?: number;
    public sponsorDiscount?: number;
    public onlineStarts?: Date;
    public onlineStops?: Date;
    public currentSeason = false;
    public currentSchedule = false;
    public gameSchedules = false;
    public onlineRegistration = false;
    
    constructor() { }
}

