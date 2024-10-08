import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-shell-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    RouterLink,
    RouterLinkActive,
    MatDividerModule,
    NgIf,
],
  templateUrl: './admin-shell-sidebar.component.html',
  styleUrls: [ './admin-shell-sidebar.component.scss',
    './../../containers/admin-shell/admin-shell.component.scss'],
})
export class AdminShellSidebarComponent {
  showDirectors = false;
  showHouseholds = false;
  showPeople = false;
  showColors = false;
  showUsers = false;
  shouldRun = true;

}
