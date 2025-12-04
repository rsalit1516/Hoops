import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {
  TableColumn,
  GenericMatTableComponent,
} from '@app/admin/shared/generic-mat-table/generic-mat-table';
import { DraftListPlayer } from '@app/domain/draft-list-player';
import { DraftListService } from '@app/services/draft-list.service';
import { SeasonService } from '@app/services/season.service';
import { DivisionService } from '@app/services/division.service';
import { Season } from '@app/domain/season';
import { Division } from '@app/domain/division';
import { LoggerService } from '@app/services/logger.service';
import { Constants } from '@app/shared/constants';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'csbc-draft-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCardModule,
    GenericMatTableComponent,
  ],
  templateUrl: './draft-list.html',
  styleUrls: ['./draft-list.scss'],
})
export class DraftList implements OnInit {
  private draftListService = inject(DraftListService);
  private seasonService = inject(SeasonService);
  private divisionService = inject(DivisionService);
  private logger = inject(LoggerService);
  private snackBar = inject(MatSnackBar);
  private http = inject(HttpClient);

  columns: TableColumn<DraftListPlayer>[] = [
    { key: 'division', header: 'Division', field: 'division', sortable: true },
    { key: 'draftId', header: 'Draft ID', field: 'draftId', sortable: true },
    { key: 'lastName', header: 'Last Name', field: 'lastName', sortable: true },
    { key: 'firstName', header: 'First Name', field: 'firstName', sortable: true },
    { key: 'dob', header: 'DOB', field: 'dob', sortable: true },
    { key: 'grade', header: 'Grade', field: 'grade', sortable: true },
    { key: 'address1', header: 'Address', field: 'address1', sortable: true },
    { key: 'city', header: 'City', field: 'city', sortable: true },
    { key: 'zip', header: 'Zip', field: 'zip', sortable: true },
  ];

  seasons = signal<Season[]>([]);
  divisions = signal<Division[]>([]);
  selectedSeason = signal<Season | null>(null);
  selectedDivision = signal<Division | null>(null);

  players = computed(() => this.draftListService.players());
  isLoading = computed(() => this.draftListService.isLoading());

  constructor() {
    effect(() => {
      const season = this.selectedSeason();
      if (season) {
        this.loadDivisions(season.seasonId);
      }
    });
  }

  ngOnInit() {
    this.loadSeasons();
  }

  private loadSeasons(): void {
    this.seasonService.seasons$.subscribe({
      next: (seasons) => {
        // Sort by FromDate descending
        const sortedSeasons = seasons.sort((a, b) => {
          const dateA = a.fromDate ? new Date(a.fromDate).getTime() : 0;
          const dateB = b.fromDate ? new Date(b.fromDate).getTime() : 0;
          return dateB - dateA;
        });
        this.seasons.set(sortedSeasons);
        // Set the first (latest) season as default
        if (sortedSeasons.length > 0) {
          this.selectedSeason.set(sortedSeasons[0]);
        }
      },
      error: (error) => {
        this.logger.error('Error loading seasons:', error);
      },
    });
  }

  private loadDivisions(seasonId: number): void {
    const url = `${Constants.SEASON_DIVISIONS_URL}${seasonId}`;
    this.http.get<Division[]>(url).subscribe({
      next: (divisions) => {
        // Sort by minDate2 or minDate descending
        const sortedDivisions = divisions.sort((a, b) => {
          const dateA = (a.minDate2 || a.minDate)
            ? new Date(a.minDate2 || a.minDate!).getTime()
            : 0;
          const dateB = (b.minDate2 || b.minDate)
            ? new Date(b.minDate2 || b.minDate!).getTime()
            : 0;
          return dateB - dateA;
        });

        // Add "All Divisions" option at the beginning
        const allDivisionsOption: Division = {
          divisionId: 0,
          divisionDescription: 'All Divisions',
          seasonId: seasonId,
        } as Division;

        this.divisions.set([allDivisionsOption, ...sortedDivisions]);
        // Clear selected division when season changes
        this.selectedDivision.set(null);
        // Clear players when season changes
        this.draftListService.clearPlayers();
      },
      error: (error) => {
        this.logger.error('Error loading divisions:', error);
      },
    });
  }

  onSeasonChange(season: Season): void {
    this.selectedSeason.set(season);
  }

  onDivisionChange(division: Division): void {
    this.selectedDivision.set(division);
    if (division && this.selectedSeason()) {
      const divisionId = division.divisionId === 0 ? null : division.divisionId;
      this.draftListService.getDraftList(
        this.selectedSeason()!.seasonId,
        divisionId
      );
    }
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
