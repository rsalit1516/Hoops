export class Team {
    teamId!: number;
    divisionId!: number;
    name?: string;
    teamColorId?: number;
    teamName?: string;
    teamNumber?: string;
    createdDate?: Date;
    createdUser?: string | undefined;
    constructor(
      _teamId? : number,
      _divisionId?: number,
      _name?: string,
      _teamName?: string,
      _teamNumber?: string,
    _teamColorId?: number) {
      this.teamId = _teamId as number;
      this.divisionId = _divisionId as number;
      this.name = _teamName;
      this.teamName = _teamName;
      this.teamNumber = _teamNumber;
      }
}
