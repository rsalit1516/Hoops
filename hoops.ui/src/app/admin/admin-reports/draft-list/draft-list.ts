import { Component, computed, effect, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {
  TableColumn,
  GenericMatTableComponent,
} from '@app/admin/shared/generic-mat-table/generic-mat-table';
import { SeasonSelect } from '@app/admin/admin-shared/season-select/season-select';
import { DivisionSelect } from '@app/admin/admin-shared/division-select/division-select';
import { DraftListPlayer } from '@app/domain/draft-list-player';
import { DraftListService } from '@app/services/draft-list.service';
import { SeasonService } from '@app/services/season.service';
import { DivisionService } from '@app/services/division.service';
import { LoggerService } from '@app/services/logger.service';

@Component({
  selector: 'csbc-draft-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCardModule,
    GenericMatTableComponent,
    SeasonSelect,
    DivisionSelect,
  ],
  templateUrl: './draft-list.html',
  styleUrls: [
    './draft-list.scss',
    './../../../shared/scss/select.scss',
    './../../../shared/scss/forms.scss',
    './../../../shared/scss/cards.scss',
    './../../../shared/scss/tables.scss',
  ],
})
export class DraftList {
  private draftListService = inject(DraftListService);
  private seasonService = inject(SeasonService);
  private divisionService = inject(DivisionService);
  private logger = inject(LoggerService);
  private snackBar = inject(MatSnackBar);

  columns: TableColumn<DraftListPlayer>[] = [
    { key: 'division', header: 'Division', field: 'division', sortable: true },
    { key: 'draftId', header: 'Draft ID', field: 'draftId', sortable: true },
    { key: 'lastName', header: 'Last Name', field: 'lastName', sortable: true },
    {
      key: 'firstName',
      header: 'First Name',
      field: 'firstName',
      sortable: true,
    },
    { key: 'dob', header: 'DOB', field: 'dob', sortable: true },
    { key: 'grade', header: 'Grade', field: 'grade', sortable: true },
    { key: 'address1', header: 'Address', field: 'address1', sortable: true },
    { key: 'city', header: 'City', field: 'city', sortable: true },
    { key: 'zip', header: 'Zip', field: 'zip', sortable: true },
  ];

  selectedSeason = computed(() => this.seasonService.selectedSeason());
  selectedDivision = computed(() => this.divisionService.selectedDivision());

  players = computed(() => this.draftListService.players());
  isLoading = computed(() => this.draftListService.isLoading());

  constructor() {
    // Load draft list when division changes
    effect(() => {
      const season = this.selectedSeason();
      const division = this.selectedDivision();
      if (season && division) {
        const divisionId =
          division.divisionId === 0 ? null : division.divisionId;
        this.draftListService.getDraftList(season.seasonId, divisionId);
      }
    });
  }

  downloadCSV(): void {
    const players = this.players();
    const season = this.selectedSeason();
    const division = this.selectedDivision();

    if (!players || players.length === 0) {
      this.snackBar.open('No data to download', 'Close', { duration: 3000 });
      return;
    }

    // Create CSV content
    const headers = [
      'Division',
      'DraftId',
      'LastName',
      'FirstName',
      'DOB',
      'Grade',
      'Address1',
      'City',
      'Zip',
    ];
    const csvContent = [
      headers.join(','),
      ...players.map((player) =>
        [
          player.division,
          player.draftId || '',
          player.lastName,
          player.firstName,
          player.dob ? new Date(player.dob).toLocaleDateString() : '',
          player.grade || '',
          player.address1 || '',
          player.city || '',
          player.zip || '',
        ].join(',')
      ),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    // Generate filename
    const seasonDesc = season?.description || 'Unknown';
    const divDesc =
      division?.divisionId === 0 ? 'All' : division?.divisionDescription || '';
    const filename = `DraftList-${seasonDesc}-${divDesc}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.snackBar.open('File downloaded successfully', 'Close', {
      duration: 3000,
    });
  }

  get showNoSelection(): boolean {
    return !this.selectedDivision() && !this.isLoading();
  }

  get showTable(): boolean {
    return !!this.selectedDivision() && !this.isLoading();
  }
}
