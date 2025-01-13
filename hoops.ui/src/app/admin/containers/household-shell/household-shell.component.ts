import { Component } from '@angular/core';
import { HouseholdDetailComponent } from '@app/admin/components/household-detail/household-detail.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-household-shell',
  imports: [CommonModule,
    HouseholdDetailComponent,
  ],
  templateUrl: './household-shell.component.html',
  styleUrl: './household-shell.component.scss'
})
export class HouseholdShellComponent {

}
