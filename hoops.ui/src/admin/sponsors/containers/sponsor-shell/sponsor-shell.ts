import { Component, signal } from '@angular/core';
import { SponsorList } from '../../components/sponsor-list/sponsor-list';
import { SponsorListItem } from '@app/domain/sponsor-profile';
import { SponsorDetail } from '../../components/sponsor-detail/sponsor-detail';

@Component({
  selector: 'sponsor-shell',
  standalone: true,
  imports: [SponsorList, SponsorDetail],
  templateUrl: './sponsor-shell.html',
  styleUrls: ['./sponsor-shell.scss'],
})
export class SponsorShell {
  readonly selectedProfileId = signal<number | null>(null);
  readonly isNewSponsor = signal(false);

  get showDetail(): boolean {
    return this.selectedProfileId() !== null || this.isNewSponsor();
  }

  onSponsorSelected(item: SponsorListItem) {
    this.isNewSponsor.set(false);
    this.selectedProfileId.set(item.sponsorProfileId);
  }

  onNewSponsor() {
    this.selectedProfileId.set(null);
    this.isNewSponsor.set(true);
  }

  onDetailClosed() {
    this.selectedProfileId.set(null);
    this.isNewSponsor.set(false);
  }
}
