import {
  Component,
  OnInit,
  inject,
  ViewChild,
  TemplateRef,
  effect,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { PaginationPreferencesService } from '@app/services/pagination-preferences.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { DraftListPlayer } from '@app/domain/draft-list-player';
import { Constants } from '@app/shared/constants';
import { SeasonService } from '@app/services/season.service';
import { DivisionService } from '@app/services/division.service';
import { SeasonSelect } from '../admin-shared/season-select/season-select';
import { DivisionSelect } from '../admin-shared/division-select/division-select';
import { LoggerService } from '@app/services/logger.service';
import { CommonModule } from '@angular/common';
import {
  GenericMatTableComponent,
  TableColumn,
} from '../shared/generic-mat-table/generic-mat-table';

@Component({
  selector: 'csbc-player-list',
  templateUrl: './player-list.html',
  styleUrls: ['./player.component.scss', '../../shared/scss/tables.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    SeasonSelect,
    DivisionSelect,
    GenericMatTableComponent,
  ],
})
export class PlayerList implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private seasonService = inject(SeasonService);
  private divisionService = inject(DivisionService);
  private logger = inject(LoggerService);
  private readonly prefs = inject(PaginationPreferencesService);

  @ViewChild('nameTemplate', { static: true })
  nameTemplate!: TemplateRef<unknown>;

  columns: TableColumn<DraftListPlayer>[] = [
    { key: 'name', header: 'Name', template: this.nameTemplate },
    { key: 'draftId', header: 'Draft ID', field: 'draftId' },
    { key: 'division', header: 'Division', field: 'division' },
  ];

  dataSource = new MatTableDataSource<DraftListPlayer>([]);
  isLoading = false;
  pageSize = this.prefs.getPageSize(25);

  constructor() {
    // Single effect tracking both season and division to avoid duplicate requests on init
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

  ngOnInit() {
    // Initial load will be triggered by season effect once season is available
  }

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
        this.dataSource.data = players;
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
    this.router.navigate(['/admin/player-registration', player.personId]);
  }
}
