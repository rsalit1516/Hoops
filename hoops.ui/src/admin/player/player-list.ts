import { Component, OnInit, inject, effect, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { PaginationPreferencesService } from '@app/services/pagination-preferences.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { DraftListPlayer } from '@app/domain/draft-list-player';
import { Person } from '@app/domain/person';
import { Constants } from '@app/shared/constants';
import { SeasonService } from '@app/services/season.service';
import { DivisionService } from '@app/services/division.service';
import { PeopleService } from '@app/services/people.service';
import { SeasonSelect } from '../admin-shared/season-select/season-select';
import { DivisionSelect } from '../admin-shared/division-select/division-select';
import { LoggerService } from '@app/services/logger.service';
import { CommonModule } from '@angular/common';
import {
  GenericMatTableComponent,
  TableColumn,
} from '../shared/generic-mat-table/generic-mat-table';
import { EligiblePersonsPanel } from './eligible-persons-panel/eligible-persons-panel';

@Component({
  selector: 'csbc-player-list',
  templateUrl: './player-list.html',
  styleUrls: [
    './player.component.scss',
    '../../shared/scss/tables.scss',
    '../../shared/scss/cards.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    SeasonSelect,
    DivisionSelect,
    GenericMatTableComponent,
    EligiblePersonsPanel,
  ],
})
export class PlayerList implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  readonly seasonService = inject(SeasonService);
  readonly divisionService = inject(DivisionService);
  private peopleService = inject(PeopleService);
  private logger = inject(LoggerService);
  private readonly prefs = inject(PaginationPreferencesService);

  columns: TableColumn<DraftListPlayer & { name: string }>[] = [
    { key: 'name', header: 'Name', field: 'name' },
    { key: 'draftId', header: 'Draft ID', field: 'draftId' },
    { key: 'division', header: 'Division', field: 'division' },
  ];

  dataSource = new MatTableDataSource<DraftListPlayer & { name: string }>([]);
  isLoading = false;
  pageSize = this.prefs.getPageSize(10);

  registeredPersonIds = signal<Set<number>>(new Set());

  constructor() {
    effect(() => {
      const season = this.seasonService.selectedSeason();
      const division = this.divisionService.selectedDivision();
      this.logger.info(
        'Season/division changed, loading players:',
        season,
        division,
      );
      if (season?.seasonId) {
        this.loadPlayers();
      }
    });
  }

  ngOnInit() {}

  loadPlayers() {
    const seasonId = this.seasonService.selectedSeason()?.seasonId;
    if (!seasonId) {
      this.logger.warn('No season selected, cannot load players');
      return;
    }

    this.isLoading = true;
    const division = this.divisionService.selectedDivision();
    const divisionId = division?.divisionId;

    let url = `${Constants.GET_SEASON_PLAYERS_URL}/${seasonId}`;
    if (divisionId && divisionId > 0) {
      url += `?divisionId=${divisionId}`;
    }

    this.logger.info('Loading players from:', url);
    this.http.get<DraftListPlayer[]>(url).subscribe({
      next: (players) => {
        this.logger.info('Players loaded:', players.length);
        this.dataSource.data = players.map((player) => ({
          ...player,
          name: `${player.lastName}, ${player.firstName}`,
        }));
        this.registeredPersonIds.set(new Set(players.map((p) => p.personId)));
        this.isLoading = false;
      },
      error: (error) => {
        this.logger.error('Error loading players:', error);
        this.isLoading = false;
      },
    });
  }

  onRowClick(player: DraftListPlayer) {
    this.logger.info('Navigating to player registration:', player);

    const fallbackPerson = new Person();
    fallbackPerson.personId = player.personId;
    fallbackPerson.firstName = player.firstName ?? '';
    fallbackPerson.lastName = player.lastName ?? '';
    fallbackPerson.birthDate = player.dob ? new Date(player.dob) : new Date();

    this.peopleService.loadAndSelectPerson(player.personId, fallbackPerson);
    this.router.navigate(['/admin/player-registration', player.personId]);
  }

  onEligiblePersonClick(person: Person): void {
    this.logger.info('Navigating to registration for eligible person:', person);
    this.peopleService.loadAndSelectPerson(person.personId, person);
    this.router.navigate(['/admin/player-registration', person.personId]);
  }
}
