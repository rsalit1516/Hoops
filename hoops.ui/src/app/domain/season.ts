
export class Season  {
    public seasonId!: number;
    public description: string | undefined;
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
    constructor(_seasonId: number) {
        this.seasonId = _seasonId;
     }
}

