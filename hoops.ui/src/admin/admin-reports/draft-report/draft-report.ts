import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { SeasonSelect } from '@app/admin/admin-shared/season-select/season-select';
import { DivisionSelect } from '@app/admin/admin-shared/division-select/division-select';
import { DraftReportService } from '@app/services/draft-report.service';
import { SeasonService } from '@app/services/season.service';
import { DivisionService } from '@app/services/division.service';
import { DraftReportPlayer } from '@app/domain/draft-report-player';

interface DivisionGroup {
  division: string;
  players: DraftReportPlayer[];
}

@Component({
  selector: 'csbc-draft-report',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    SeasonSelect,
    DivisionSelect,
  ],
  templateUrl: './draft-report.html',
  styleUrls: [
    './draft-report.scss',
    './../../../shared/scss/select.scss',
    './../../../shared/scss/forms.scss',
    './../../../shared/scss/cards.scss',
  ],
})
export class DraftReport {
  private draftReportService = inject(DraftReportService);
  private seasonService = inject(SeasonService);
  private divisionService = inject(DivisionService);

  selectedSeason = computed(() => this.seasonService.selectedSeason());
  selectedDivision = computed(() => this.divisionService.selectedDivision());
  isLoading = computed(() => this.draftReportService.isLoading());

  groupedByDivision = computed((): DivisionGroup[] => {
    const players = this.draftReportService.players();
    const division = this.selectedDivision();

    if (!players.length) return [];

    if (division?.divisionId === 0) {
      const map = new Map<string, DraftReportPlayer[]>();
      for (const p of players) {
        if (!map.has(p.division)) map.set(p.division, []);
        map.get(p.division)!.push(p);
      }
      return [...map.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([div, divPlayers]) => ({ division: div, players: divPlayers }));
    }

    return [{ division: division?.divisionDescription ?? '', players }];
  });

  get showNoSelection(): boolean {
    return !this.selectedDivision() && !this.isLoading();
  }

  get showReport(): boolean {
    return !!this.selectedDivision() && !this.isLoading();
  }

  formatDob(val: Date | string | null): string {
    if (!val) return '';
    const parts = String(val).split('T')[0].split('-');
    return `${parts[1]}/${parts[2]}/${parts[0]}`;
  }

  print(): void {
    window.print();
  }

  constructor() {
    effect(() => {
      const season = this.selectedSeason();
      const division = this.selectedDivision();
      if (season && division) {
        const divisionId = division.divisionId === 0 ? null : division.divisionId;
        this.draftReportService.getDraftReport(season.seasonId, divisionId);
      }
    });
  }
}
