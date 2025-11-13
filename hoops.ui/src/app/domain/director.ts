export class Director {
  directorId!: number;
  companyId!: number;
  peopleId!: number;
  seq!: number;
  title!: string;
  name!: string;
  createdDate!: Date;
  createdUser: string | undefined;
  constructor(
    directorId: number,
    name: string,
    companyId: number,
    peopleId: number,
    seq: number,
    title: string
  ) {}
}

// Interface for director list display
export interface DirectorListItem {
  id: number; // For BaseList compatibility
  directorId: number;
  name: string;
  title: string;
}
