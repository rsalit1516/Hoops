import {
  Component,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Division } from '@app/domain/division';
import { Person } from '@app/domain/person';
import { PeopleService } from '@app/services/people.service';
import { LoggerService } from '@app/services/logger.service';

@Component({
  selector: 'csbc-eligible-persons-panel',
  templateUrl: './eligible-persons-panel.html',
  styleUrls: [
    '../player.component.scss',
    '../../../shared/scss/cards.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
  ],
})
export class EligiblePersonsPanel implements OnInit {
  private readonly peopleService = inject(PeopleService);
  private readonly logger = inject(LoggerService);

  division = input<Division | undefined>(undefined);
  registeredPersonIds = input<Set<number>>(new Set());

  personSelected = output<Person>();

  private allPeople = signal<Person[]>([]);
  isLoading = signal(false);
  searchTerm = signal('');

  eligiblePeople = computed(() => {
    const division = this.division();
    if (!division) return [];
    const registered = this.registeredPersonIds();
    const term = this.searchTerm().toLowerCase().trim();
    return this.allPeople()
      .filter((p) => {
        if (!p.player || registered.has(p.personId)) return false;
        if (!this.isEligibleForDivision(p, division)) return false;
        if (term) {
          const first = (p.firstName ?? '').toLowerCase();
          const last = (p.lastName ?? '').toLowerCase();
          return first.includes(term) || last.includes(term);
        }
        return true;
      })
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  });

  ngOnInit(): void {
    this.loadAllPeople();
  }

  private loadAllPeople(): void {
    this.isLoading.set(true);
    this.peopleService.getAllPeople().subscribe({
      next: (people) => {
        this.allPeople.set(people);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.logger.error('Error loading people for eligibility panel:', error);
        this.isLoading.set(false);
      },
    });
  }

  private isEligibleForDivision(person: Person, division: Division): boolean {
    if (!person.birthDate || !person.gender) return false;
    const birthTime = new Date(person.birthDate).getTime();
    const gender = person.gender.toUpperCase();

    if (division.gender?.toUpperCase() === gender) {
      if (this.isDateInRange(birthTime, division.minDate, division.maxDate))
        return true;
    }
    if (division.gender2?.toUpperCase() === gender) {
      if (this.isDateInRange(birthTime, division.minDate2, division.maxDate2))
        return true;
    }
    return false;
  }

  private isDateInRange(
    birthTime: number,
    minDate: Date | undefined,
    maxDate: Date | undefined,
  ): boolean {
    if (!minDate || !maxDate) return false;
    return (
      birthTime >= new Date(minDate).getTime() &&
      birthTime <= new Date(maxDate).getTime()
    );
  }
}
