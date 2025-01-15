import { Component } from '@angular/core';
import { HouseholdDetailComponent } from '@app/admin/components/household-detail/household-detail.component';
import { CommonModule } from '@angular/common';
import { HouseholdSearchComponent } from '@app/admin/components/household-search/household-search.component';

@Component({
  selector: 'app-household-shell',
  imports: [CommonModule,
    HouseholdDetailComponent,
    HouseholdSearchComponent
  ],
  templateUrl: './household-shell.component.html',
  styleUrl: './household-shell.component.scss'
})
export class HouseholdShellComponent {

}
