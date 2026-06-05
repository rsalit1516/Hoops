import { Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import {
  animate,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { SponsorService } from '../../sponsor.service';
import { Sponsor } from '@app/domain/sponsor';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-sponsor-list',
  templateUrl: './sponsor-list.html',
  styleUrls: ['./sponsor-list.scss'],
  animations: [
    trigger('fadeSponsor', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(6px)' }),
        animate('350ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('350ms ease-in', style({ opacity: 0, transform: 'translateY(-6px)' })),
      ]),
    ]),
  ],
  imports: [],
})
export class SponsorList implements OnInit {
  private readonly sponsorService = inject(SponsorService);
  private readonly destroyRef = inject(DestroyRef);

  readonly displayDurationMs = input<number>(4000);
  readonly currentYear = new Date().getFullYear();

  readonly sponsors = this.sponsorService.sponsors;
  private readonly currentIndex = signal(0);

  readonly currentSponsor = computed<Sponsor | null>(() => {
    const list = this.sponsors();
    return list.length > 0 ? list[this.currentIndex()] : null;
  });

  readonly currentSponsorArray = computed<Sponsor[]>(() => {
    const s = this.currentSponsor();
    return s ? [s] : [];
  });

  ngOnInit(): void {
    interval(this.displayDurationMs())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const len = this.sponsors().length;
        if (len > 0) {
          this.currentIndex.update((i) => (i + 1) % len);
        }
      });
  }

  onLogoError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
