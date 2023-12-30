import { Component, OnInit } from '@angular/core';
import { Team } from '@app/domain/team';
import { Store } from '@ngrx/store';

import * as fromAdmin from '../../state';
import * as adminActions from '../../state/admin.actions';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-admin-team-list',
    templateUrl: './admin-team-list.component.html',
    styleUrls: ['./admin-team-list.component.scss', '../../admin.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        MatCardModule,
        MatTableModule,
        NgIf,
        MatButtonModule,
        MatIconModule,
    ],
})
export class AdminTeamListComponent implements OnInit {
  title = 'Team List';
  dataSource!: Team[];
  teams!: Team[];
  canEdit = true;
  displayedColumns = [ 'teamName' ];
  clickedRows = new Set<Team>();

  constructor(private store: Store<fromAdmin.State>) {
  }

  ngOnInit(): void {
    this.store.select(fromAdmin.getDivisionTeams).subscribe((teams) => {
      this.dataSource = teams;
    });
  }

  selectRow(row: any) {
    console.log(row);
    this.store.dispatch(new adminActions.SetSelectedTeam(row));
  }
  editTeam(team: Team) {}
  newTeam() {

  }
}
