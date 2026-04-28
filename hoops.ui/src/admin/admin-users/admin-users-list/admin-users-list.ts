import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  effect,
  inject,
  model,
} from '@angular/core';
import { Router } from '@angular/router';

import { PaginationPreferencesService } from '@app/services/pagination-preferences.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { User } from '@app/domain/user';
import { AdminUsersService } from '../admin-users.service';
import {
  GenericMatTableComponent,
  TableColumn,
} from '../../shared/generic-mat-table/generic-mat-table';

import { LoggerService } from '@app/services/logger.service';

@Component({
  selector: 'csbc-admin-users-list',
  standalone: true,
  imports: [GenericMatTableComponent, MatIconModule, MatButtonModule],
  templateUrl: './admin-users-list.html',
  styleUrls: ['./admin-users-list.scss', '../../../shared/scss/tables.scss'],
})
export class AdminUsersList implements OnInit {
  private usersService = inject(AdminUsersService);
  private readonly logger = inject(LoggerService);
  private router = inject(Router);
  private readonly prefs = inject(PaginationPreferencesService);
  selectedLetter = model<string>('A');
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  columns: TableColumn<User>[] = [];
  pageSize = this.prefs.getPageSize(10);

  @ViewChild('userTypeTemplate', { static: true })
  userTypeTemplate!: TemplateRef<unknown>;

  constructor() {
    // Reactively update table when users list changes
    effect(() => {
      const users = this.usersService.users();
      const mapped = users.map((u) => ({
        ...u,
        firstName: u.firstName ?? '',
        lastName: u.lastName ?? '',
      }));
      this.allUsers = mapped;
      this.filteredUsers = mapped;
    });
    effect(() => {
      const letter = this.selectedLetter();
      this.logger.info('Selected letter changed:', letter);
      // Update criteria when letter changes
      //this.usersService.updateSelectedCriteria({
    });
  }
  ngOnInit(): void {
    this.columns = [
      { key: 'userName', header: 'Username', field: 'userName' },
      { key: 'name', header: 'Name', field: 'name' },
      {
        key: 'userType',
        header: 'User Type',
        template: this.userTypeTemplate,
      },
    ];

    // Kick off load using signals API
    this.usersService.loadUsers();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const filter = filterValue.trim().toLowerCase();
    if (!filter) {
      this.filteredUsers = this.allUsers;
      return;
    }

    this.filteredUsers = this.allUsers.filter((user) => {
      const name =
        `${user.firstName ?? ''} ${user.lastName ?? ''}`.toLowerCase();
      const displayName = (user.name ?? '').toLowerCase();
      const username = (user.userName ?? '').toLowerCase();
      const type = this.userTypeLabel(user.userType).toLowerCase();

      return (
        name.includes(filter) ||
        displayName.includes(filter) ||
        username.includes(filter) ||
        type.includes(filter)
      );
    });
  }

  userTypeLabel(userType?: number): string {
    if (userType === 3) return 'Admin';
    if (userType === 2) return 'Director';
    if (userType === 1) return 'User';
    return 'Unknown';
  }

  selectUser(user: User): void {
    // Set the selected user in the service
    this.usersService.selectedUser.set(user);
    // Navigate to detail view
    this.router.navigate(['/admin/users/detail']);
  }

  createNewUser(): void {
    // Clear selected user for new user creation
    this.usersService.selectedUser.set(null);
    // Navigate to detail view
    this.router.navigate(['/admin/users/detail']);
  }
}
