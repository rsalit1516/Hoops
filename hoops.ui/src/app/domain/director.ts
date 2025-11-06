export class Director {
  id!: number;
  companyId!: number;
  peopleId!: number;
  seq!: number;
  title!: string;
  name!: string;
  createdDate!: Date;
  createdUser: string | undefined;
  constructor(
    id: number,
    name: string,
    companyId: number,
    peopleId: number,
    seq: number,
    title: string
  ) {}
}

// Interface for director list display
export interface DirectorListItem {
  id: number;
  name: string;
  title: string;
}
