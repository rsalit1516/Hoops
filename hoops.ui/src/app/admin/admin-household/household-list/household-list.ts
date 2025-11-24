import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BaseList } from '@app/admin/shared/BaseList';
import {
  TableColumn,
  GenericMatTableComponent,
} from '@app/admin/shared/generic-mat-table/generic-mat-table';
import { Household, HouseholdListItem } from '@app/domain/household';
import { HouseholdService } from '@app/services/household.service';
import {
  HouseholdFilterCriteria,
  HouseholdFilters,
} from '../household-filters/household-filters';
import { ListPageShellComponent } from '@app/admin/shared/list-page-shell/ListPageShell';
import { LoggerService } from '@app/services/logger.service';

@Component({
  selector: 'csbc-household-list',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    GenericMatTableComponent,
    ListPageShellComponent,
    HouseholdFilters,
  ],
  templateUrl: './household-list.html',
  styleUrl: './household-list.scss',
})
export class HouseholdList extends BaseList<HouseholdListItem> implements OnInit {
  private householdService = inject(HouseholdService);
  private logger = inject(LoggerService);

  override get basePath(): string {
    return '/admin/households';
  }

  columns: TableColumn<HouseholdListItem>[] = [
    { key: 'houseId', header: 'ID', field: 'houseId' },
    { key: 'name', header: 'Name', field: 'name' },
    { key: 'address1', header: 'Address', field: 'address1' },
    { key: 'phone', header: 'Phone', field: 'phone' },
    { key: 'email', header: 'Email', field: 'email' },
  ];

  filters = signal<HouseholdFilterCriteria>({ letter: 'A' });

  constructor() {
    super();
    // Initialize with 'A' filter on construction
    effect(() => {
      const currentFilters = this.filters();
      this.logger.info('Household filters changed:', currentFilters);
    });
  }

  ngOnInit() {
    // Load initial data with 'A' filter
    this.onFilterChange({ letter: 'A' });
  }

  // Computed signal to convert Households to HouseholdListItems
  households = computed(() => {
    const householdsData = this.householdService.householdSearchResults();
    if (!householdsData) return [];

    return householdsData.map(
      (household) =>
        ({
          id: household.houseId, // For BaseList compatibility
          houseId: household.houseId,
          name: household.name,
          address1: household.address1,
          phone: household.phone,
          email: household.email,
        } as HouseholdListItem)
    );
  });

  // Computed signal for filtered households
  filteredHouseholds = computed(() => {
    const households = this.households();
    const filterCriteria = this.filters();

    if (!filterCriteria || Object.keys(filterCriteria).length === 0) {
      return households;
    }

    // Filter logic is handled by the service/backend
    // This computed just passes through the data
    return households;
  });

  onFilterChange(filters: HouseholdFilterCriteria): void {
    this.logger.info('Filter change received:', filters);
    this.filters.set(filters);

    // Update service criteria and execute search
    const criteria = {
      householdName: filters.letter || '',
      address: '',
      email: filters.email || '',
      phone: filters.phone || '',
    };

    // If there's a searchText, use it instead of just the letter
    if (filters.searchText) {
      criteria.householdName = filters.searchText;
    }

    this.householdService.selectedCriteria.set(criteria);
    this.householdService.executeSearch();
  }

  onRowClick(item: HouseholdListItem): void {
    this.logger.info('Row clicked:', item);
    // Convert back to full Household for service
    const household = new Household();
    household.houseId = item.houseId;
    household.name = item.name;
    household.address1 = item.address1;
    household.phone = item.phone;
    household.email = item.email;

    this.householdService.updateSelectedHousehold(household);
    this.router.navigate(['..', 'detail'], { relativeTo: this.route });
  }
}
