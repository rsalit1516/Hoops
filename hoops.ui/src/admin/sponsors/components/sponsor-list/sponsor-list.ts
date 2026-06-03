import {
  Component,
  computed,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BaseList } from '@app/admin/shared/BaseList';
import {
  TableColumn,
  GenericMatTableComponent,
} from '@app/admin/shared/generic-mat-table/generic-mat-table';
import { ListPageShellComponent } from '@app/admin/shared/list-page-shell/ListPageShell';
import { LoggerService } from '@app/services/logger.service';
import { SeasonService } from '@app/services/season.service';
import { SponsorService } from '@app/services/sponsor.service';
import { SponsorListItem } from '@app/domain/sponsor-profile';
import {
  SponsorFilters,
  SponsorFilterCriteria,
} from '../sponsor-filters/sponsor-filters';

@Component({
  selector: 'sponsor-list',
  imports: [GenericMatTableComponent, ListPageShellComponent, SponsorFilters, MatButtonModule, MatIconModule],
  templateUrl: './sponsor-list.html',
  styleUrls: ['./sponsor-list.scss', '../../../admin.scss'],
  standalone: true,
})
export class SponsorList extends BaseList<SponsorListItem> implements OnInit {
  private logger = inject(LoggerService);
  private seasonService = inject(SeasonService);
  private sponsorService = inject(SponsorService);

  readonly sponsors = signal<SponsorListItem[]>([]);
  readonly isLoading = signal(false);
  readonly filters = signal<SponsorFilterCriteria>({ name: '', currentSeasonOnly: false });

  readonly sponsorSelected = output<SponsorListItem>();
  readonly newSponsor = output<void>();

  override get basePath(): string {
    return '/admin/sponsors';
  }

  columns: TableColumn<SponsorListItem>[] = [
    { key: 'spoName', header: 'Sponsor Name', field: 'spoName', sortable: true },
    { key: 'contactName', header: 'Contact', field: 'contactName', sortable: true },
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

  onRowClick(item: SponsorListItem) {
    this.sponsorSelected.emit(item);
  }

  onNewClick() {
    this.newSponsor.emit();
  }

  private loadSponsors() {
    this.isLoading.set(true);
    this.sponsorService.getSponsors().subscribe({
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
