export class Division {
  public seasonId!: number;
  public divisionId!: number;
  // public divisionName: string,
  public divisionDescription!: string;
  public minDate: Date | undefined;
  public maxDate!: Date | undefined;
  public gender: string = 'M';
  public minDate2!: Date | undefined;
  public maxDate2!: Date | undefined;
  public gender2: string = 'M';
  // Director is optional; use null when not set to avoid FK violations
  public directorId: number | null = null;
  public createdDate?: Date | string | null;
  public createdUser?: number | null;
  public modifiedDate?: Date | string | null;
  public modifiedUser?: number | null;
}
