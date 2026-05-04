import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  TableColumn,
  GenericMatTableComponent,
} from '@app/admin/shared/generic-mat-table/generic-mat-table';
import { SeasonSelect } from '@app/admin/admin-shared/season-select/season-select';
import { GameService } from '@app/services/game.service';
import { SeasonService } from '@app/services/season.service';
import { DivisionService } from '@app/services/division.service';

export interface ScheduleRow {
  gameDate: string;
  gameTime: string;
  location: string;
  division: string;
  homeTeam: string;
  awayTeam: string;
  gameType: string;
}

@Component({
  selector: 'csbc-daily-schedule',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    GenericMatTableComponent,
    SeasonSelect,
  ],
  templateUrl: './daily-schedule.html',
  styleUrls: [
    './daily-schedule.scss',
    '../../../shared/scss/select.scss',
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
    '../../../shared/scss/tables.scss',
  ],
})
export class DailyScheduleReport {
  private gameService = inject(GameService);
  private seasonService = inject(SeasonService);
  private divisionService = inject(DivisionService);
  private snackBar = inject(MatSnackBar);

  readonly ALL_DIVISIONS_ID = 0;

  selectedDivisionId = signal<number>(this.ALL_DIVISIONS_ID);

  private today = new Date();
  startDate = signal<Date | null>(
    new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()),
  );
  endDate = signal<Date | null>(
    new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()),
  );

  divisionsForSelect = computed(() => [
    { divisionId: 0, divisionDescription: 'All Divisions' },
    ...(this.divisionService.seasonDivisions() ?? []),
  ]);

  filteredGames = computed((): ScheduleRow[] => {
    const allGames = this.gameService.seasonGames;
    if (!allGames) return [];

    const divisionId = this.selectedDivisionId();
    const start = this.startDate();
    const end = this.endDate();
    const endOfDay = end
      ? new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59)
      : null;

    return allGames
      .filter((game) => {
        const gameDate = new Date(game.gameDate);
        const afterStart = !start || gameDate >= start;
        const beforeEnd = !endOfDay || gameDate <= endOfDay;
        const inDivision =
          divisionId === this.ALL_DIVISIONS_ID || game.divisionId === divisionId;
        return afterStart && beforeEnd && inDivision;
      })
      .sort((a, b) => {
        const dateA = new Date(a.gameDate).getTime();
        const dateB = new Date(b.gameDate).getTime();
        if (dateA !== dateB) return dateA - dateB;
        const timeA = a.gameTimeString ?? '';
        const timeB = b.gameTimeString ?? '';
        if (timeA !== timeB) return timeA.localeCompare(timeB);
        const divA = a.divisionDescription ?? '';
        const divB = b.divisionDescription ?? '';
        return divA.localeCompare(divB);
      })
      .map((game) => ({
        gameDate: new Date(game.gameDate).toLocaleDateString('en-US', {
          month: 'numeric',
          day: 'numeric',
          year: 'numeric',
        }),
        gameTime: this.formatTimeString(game.gameTimeString),
        location: game.locationName ?? '',
        division: game.divisionDescription ?? '',
        homeTeam: game.homeTeamName ?? '',
        awayTeam: game.visitingTeamName ?? '',
        gameType: game.gameType ? 'Playoff' : 'Regular',
      }));
  });

  columns: TableColumn<ScheduleRow>[] = [
    { key: 'gameDate', header: 'Date', field: 'gameDate', sortable: true },
    { key: 'gameTime', header: 'Time', field: 'gameTime', sortable: true },
    { key: 'location', header: 'Location', field: 'location', sortable: true },
    { key: 'division', header: 'Division', field: 'division', sortable: true },
    { key: 'homeTeam', header: 'Home Team', field: 'homeTeam', sortable: true },
    { key: 'awayTeam', header: 'Away Team', field: 'awayTeam', sortable: true },
    { key: 'gameType', header: 'Type', field: 'gameType', sortable: true },
  ];

  hasSeasonSelected = computed(() => !!this.seasonService.selectedSeason());

  isLoadingGames = computed(
    () => this.hasSeasonSelected() && this.gameService.seasonGames === null,
  );

  get showTable(): boolean {
    return this.gameService.seasonGames !== null && !this.isLoadingGames();
  }

  // Handles "1899-12-30 20:30:00" (SQL Server), "9:00 AM", "09:00", "14:30" → "08:30 PM"
  private formatTimeString(timeStr: string | undefined): string {
    if (!timeStr) return '';
    // No anchors — matches the time portion anywhere in the string (e.g. inside a full datetime)
    const match = timeStr.match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?/i);
    if (!match) return timeStr;
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const meridiem = match[3]?.toUpperCase();
    if (meridiem) {
      return `${hours.toString().padStart(2, '0')}:${minutes} ${meridiem}`;
    }
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  }

  downloadCSV(): void {
    const games = this.filteredGames();
    if (games.length === 0) {
      this.snackBar.open('No data to download', 'Close', { duration: 3000 });
      return;
    }

    const headers = ['Date', 'Time', 'Location', 'Division', 'Home Team', 'Away Team', 'Type'];
    const rows = games.map((g) =>
      [
        g.gameDate,
        g.gameTime,
        `"${g.location}"`,
        g.division,
        `"${g.homeTeam}"`,
        `"${g.awayTeam}"`,
        g.gameType,
      ].join(','),
    );

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const startStr = this.startDate()?.toLocaleDateString('en-CA') ?? '';
    const endStr = this.endDate()?.toLocaleDateString('en-CA') ?? '';
    link.setAttribute('href', url);
    link.setAttribute('download', `DailySchedule-${startStr}-${endStr}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.snackBar.open('File downloaded successfully', 'Close', { duration: 3000 });
  }
}
