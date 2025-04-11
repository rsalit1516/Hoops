import { Component, computed, effect, inject, OnInit } from '@angular/core';
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
import { TeamService } from '@app/services/team.service';

@Component({
  selector: 'csbc-admin-team-list',
  templateUrl: './admin-team-list.component.html',
  styleUrls: [
    '../../../shared/scss/cards.scss',
    '../../../shared/scss/tables.scss',
    './admin-team-list.component.scss',
    '../../admin.component.scss'
  ],
  imports: [
    FormsModule,
    MatCardModule,
    MatTableModule,
    NgIf,
    MatButtonModule,
    MatIconModule,
  ]
})
export class AdminTeamListComponent implements OnInit {
  readonly #teamService = inject(TeamService);
  private store = inject(Store<fromAdmin.State>);
  title = 'Team List';
  teams = computed(() => this.#teamService.divisionTeams);
  dataSource!: Team[];
  //  teams!: Team[];
  canEdit = true;
  displayedColumns = [ 'teamName', 'teamColor', 'teamNumber' ];
  clickedRows = new Set<Team>();

  constructor() {
    effect(() => {
      this.dataSource = this.#teamService.divisionTeams();
    });
  }

  ngOnInit(): void {
    // this.store.select(fromAdmin.getDivisionTeams).subscribe((teams) => {
    this.dataSource = this.#teamService.divisionTeams();
    // });
  }

  selectRow(row: any) {
    console.log(row);
    this.#teamService.updateSelectedTeam(row);
    // this.store.dispatch(new adminActions.SetSelectedTeam(row));
  }
  editTeam(team: Team) { }
  newTeam() {

  }
}
