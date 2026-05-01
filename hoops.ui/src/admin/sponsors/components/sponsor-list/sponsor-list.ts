import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseList } from '@app/admin/shared/BaseList';
import {
  TableColumn,
  GenericMatTableComponent,
} from '@app/admin/shared/generic-mat-table/generic-mat-table';
import { ListPageShellComponent } from '@app/admin/shared/list-page-shell/ListPageShell';
import { LoggerService } from '@app/services/logger.service';
import { SeasonService } from '@app/services/season.service';
import { Constants } from '@app/shared/constants';
import {
  SponsorFilters,
  SponsorFilterCriteria,
} from '../sponsor-filters/sponsor-filters';

interface SponsorListItem {
  id: number;
  sponsorProfileId: number;
  spoName: string;
  contactName: string;
  email: string;
  phone: string;
  lastSeasonId: number | null;
  lastSeasonDescription: string | null;
}

@Component({
  selector: 'sponsor-list',
  imports: [GenericMatTableComponent, ListPageShellComponent, SponsorFilters],
  templateUrl: './sponsor-list.html',
  styleUrls: ['./sponsor-list.scss', '../../../admin.scss'],
  standalone: true,
})
export class SponsorList extends BaseList<SponsorListItem> implements OnInit {
  private http = inject(HttpClient);
  private logger = inject(LoggerService);
  private seasonService = inject(SeasonService);

  readonly sponsors = signal<SponsorListItem[]>([]);
  readonly isLoading = signal(false);
  readonly filters = signal<SponsorFilterCriteria>({ name: '', currentSeasonOnly: false });

  override get basePath(): string {
    return '/admin/sponsors';
  }

  columns: TableColumn<SponsorListItem>[] = [
    { key: 'spoName', header: 'Sponsor Name', field: 'spoName', sortable: true },
    { key: 'lastSeasonDescription', header: 'Last Season', field: 'lastSeasonDescription', sortable: true },
  ];

  readonly filteredSponsors = computed(() => {
    const sponsors = this.sponsors();
    const { name, currentSeasonOnly } = this.filters();
    const currentSeasonId = this.seasonService.currentSeason()?.seasonId;

    return sponsors.filter((s) => {
      const nameMatch = !name || s.spoName.toLowerCase().includes(name.toLowerCase());
      const seasonMatch =
        !currentSeasonOnly ||
        (currentSeasonId !== undefined && s.lastSeasonId === currentSeasonId);
      return nameMatch && seasonMatch;
    });
  });

  ngOnInit() {
    this.seasonService.fetchCurrentSeason();
    this.loadSponsors();
  }

  onFilterChange(filters: SponsorFilterCriteria) {
    this.filters.set(filters);
  }

  private loadSponsors() {
    this.isLoading.set(true);
    this.http
      .get<SponsorListItem[]>(Constants.GET_SPONSOR_PROFILES_URL, { withCredentials: true })
      .subscribe({
        next: (sponsors) => {
          this.sponsors.set((sponsors ?? []).map((s) => ({ ...s, id: s.sponsorProfileId })));
          this.isLoading.set(false);
        },
        error: (err) => {
          this.logger.error('Failed to load sponsors', err);
          this.isLoading.set(false);
        },
      });
  }
}
