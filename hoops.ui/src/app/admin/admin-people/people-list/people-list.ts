import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BaseList } from '@app/admin/shared/BaseList';
import {
  TableColumn,
  GenericMatTableComponent,
} from '@app/admin/shared/generic-mat-table/generic-mat-table';
import { Person, PersonListItem } from '@app/domain/person';
import { PeopleService } from '@app/services/people.service';
import {
  PeopleFilterCriteria,
  PeopleFilters,
} from '../people-filters/people-filters';
import { ListPageShellComponent } from '@app/admin/shared/list-page-shell/ListPageShell';
import { LoggerService } from '@app/services/logger.service';
import { HouseholdService } from '@app/services/household.service';

// Type for Person with id property for BaseList compatibility
type PersonWithId = Person & { id: number };

@Component({
  selector: 'csbc-people-list',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    GenericMatTableComponent,
    ListPageShellComponent,
    PeopleFilters,
  ],
  templateUrl: './people-list.html',
  styleUrls: ['./people-list.scss'],
})
export class PeopleList extends BaseList<PersonWithId> implements OnInit {
  private peopleService = inject(PeopleService);
  private householdService = inject(HouseholdService);
  private logger = inject(LoggerService);

  override get basePath(): string {
    return '/admin/people';
  }

  columns: TableColumn<PersonWithId>[] = [
    { key: 'houseId', header: 'Household', field: 'houseId' },
    { key: 'lastName', header: 'Last Name', field: 'lastName' },
    { key: 'firstName', header: 'First Name', field: 'firstName' },
    { key: 'birthDate', header: 'Birth Date', field: 'birthDate' },
    { key: 'gender', header: 'Gender', field: 'gender' },
  ];

  filters = signal<PeopleFilterCriteria>({
    lastName: 'A',
    firstName: '',
    playerOnly: false,
    letter: 'A',
  });

  constructor() {
    super();
    // Initialize with 'A' filter on construction
    effect(() => {
      const currentFilters = this.filters();
      this.logger.info('People filters changed:', currentFilters);
    });
  }

  ngOnInit() {
    // Check for saved criteria in localStorage
    const saved = localStorage.getItem('peopleSearchCriteria');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.logger.info('Loading saved search criteria:', parsed);

        // Determine the letter from saved criteria
        let letter = 'A';
        if (parsed.lastName && parsed.lastName.length === 1) {
          letter = parsed.lastName.toUpperCase();
        }

        this.onFilterChange({
          lastName: parsed.lastName || letter,
          firstName: parsed.firstName || '',
          playerOnly: parsed.playerOnly || false,
          letter: letter,
        });
      } catch (e) {
        this.logger.info('Invalid search criteria in storage', e);
        localStorage.removeItem('peopleSearchCriteria');
        // Load with default 'A' filter
        this.onFilterChange({ lastName: 'A', firstName: '', playerOnly: false, letter: 'A' });
      }
    } else {
      // Load initial data with 'A' filter
      this.onFilterChange({ lastName: 'A', firstName: '', playerOnly: false, letter: 'A' });
    }
  }

  // Computed signal to get people from service
  people = computed((): PersonWithId[] => {
    const peopleData = this.peopleService.results();
    if (!peopleData) return [];

    // Map to ensure 'id' property exists for BaseList compatibility
    return peopleData.map(person => ({
      ...person,
      id: person.personId
    } as PersonWithId));
  });

  // Computed signal for filtered people
  filteredPeople = computed(() => {
    const people = this.people();
    const filterCriteria = this.filters();

    if (!filterCriteria || Object.keys(filterCriteria).length === 0) {
      return people;
    }

    // Filter logic is handled by the service/backend
    // This computed just passes through the data
    return people;
  });

  onFilterChange(filters: PeopleFilterCriteria): void {
    this.logger.info('Filter change received:', filters);
    this.filters.set(filters);

    // Update service criteria and execute search
    this.peopleService.updateSelectedCriteria({
      lastName: filters.lastName || filters.letter || '',
      firstName: filters.firstName || '',
      playerOnly: filters.playerOnly || false,
    });
  }

  onRowClick(person: PersonWithId): void {
    this.logger.info('Row clicked:', person);
    // Pass the full Person object to the service (PersonWithId is a Person with extra id property)
    this.peopleService.updateSelectedPerson(person);
    this.householdService.selectedHouseholdByHouseId(person.houseId);
    this.router.navigate(['..', 'detail'], { relativeTo: this.route });
  }
}
