import { Component } from '@angular/core';
import { HouseholdDetailComponent } from '@app/admin/components/household-detail/household-detail.component';
import { CommonModule } from '@angular/common';
import { HouseholdSearchComponent } from '@app/admin/components/household-search/household-search.component';
import { HouseholdListComponent } from '@app/admin/components/household-list/household-list.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-household-shell',
  imports: [ CommonModule,
    HouseholdDetailComponent,
    HouseholdSearchComponent,
    HouseholdListComponent
  ],
  templateUrl: './household-shell.component.html',
  styleUrl: './household-shell.component.scss'
})
export class HouseholdShellComponent {
  pageTitle = 'Household Management';

}
