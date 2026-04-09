import {
  Component,
  computed,
  inject,
  model,
  OnInit,
  signal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggerService } from '@app/services/logger.service';
import { Constants } from '@app/shared/constants';
import { AlphabeticalSearch } from '@app/admin/admin-shared/alphabetical-search/alphabetical-search';

interface SponsorProfileListItem {
  sponsorProfileId: number;
  spoName: string;
  contactName: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'sponsor-shell',
  templateUrl: './sponsor-shell.html',
  styleUrls: ['./sponsor-shell.css'],
  standalone: true,
  imports: [AlphabeticalSearch],
})
export class SponsorShell implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggerService);
  readonly sponsors = signal<SponsorProfileListItem[]>([]);
  selectedLetter = model<string>('');
  readonly nameFilter = signal<string>('');
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly filteredSponsors = computed(() => {
    const sponsors = this.sponsors();
    const letter = this.selectedLetter().trim().toLowerCase();
    const name = this.nameFilter().trim().toLowerCase();

    return sponsors.filter((sponsor) => {
      const sponsorName = (sponsor.spoName ?? '').toLowerCase();
      const matchesLetter = !letter || sponsorName.startsWith(letter);
      const matchesName = !name || sponsorName.includes(name);
      return matchesLetter && matchesName;
    });
  });

  ngOnInit(): void {
    this.loadSponsors();
  }

  onNameFilterInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.nameFilter.set(value ?? '');
  }

  private loadSponsors(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.http
      .get<SponsorProfileListItem[]>(Constants.GET_SPONSOR_PROFILES_URL, {
        withCredentials: true,
      })
      .subscribe({
        next: (sponsors) => {
          this.sponsors.set(sponsors ?? []);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.logger.error('Failed to load sponsor profiles', error);
          this.errorMessage.set('Unable to load sponsors. Please try again.');
          this.isLoading.set(false);
        },
      });
  }
}
