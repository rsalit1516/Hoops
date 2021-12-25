export class Team {
    teamId!: number;
    divisionId!: number;
    name!: string;
    teamColorId?: number;
    teamName?: string;
    teamNumber?: string;
    constructor(
      _teamId? : number,
      _divisionId?: number,
      _name?: string,
      _teamName?: string,
      _teamNumber?: string) {
      this.teamId = _teamId;
      this.divisionId = _divisionId;
      this.name = _name;
      this.teamName = _teamName;
      this.teamNumber = _teamNumber;
      }
}
