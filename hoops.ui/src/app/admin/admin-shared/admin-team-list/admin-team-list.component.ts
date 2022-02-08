import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Team } from '@app/domain/team';
import { Store } from '@ngrx/store';

import * as fromAdmin from '../../state';
import * as adminActions from '../../state/admin.actions';

@Component({
  selector: 'app-admin-team-list',
  templateUrl: './admin-team-list.component.html',
  styleUrls: ['./admin-team-list.component.scss'],
})
export class AdminTeamListComponent implements OnInit {
  title = 'Team List';
  dataSource: MatTableDataSource<Team> | undefined;
  teams!: Team[];
  canEdit = true;
  displayedColumns = ['teamNo', 'teamName', 'color', 'coach'];
  clickedRows = new Set<Team>();

  constructor(private store: Store<fromAdmin.State>) {
    this.store.select(fromAdmin.getDivisionTeams).subscribe((teams) => {
      this.dataSource = new MatTableDataSource(teams);
    });
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.teams);
  }

  selectRow(row: any) {
    console.log(row);
    this.store.dispatch(new adminActions.SetSelectedTeam(row));
  }
  editTeam(team: Team) {}
}
