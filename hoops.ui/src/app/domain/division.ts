export class Division {
  public companyId: number = 1;
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
}
