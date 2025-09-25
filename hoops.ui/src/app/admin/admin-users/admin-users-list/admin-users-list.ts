import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  effect,
  inject,
  model,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { User } from '@app/domain/user';
import { AdminUsersService } from '../admin-users.service';
import { AlphabeticalSearch } from '@app/admin/admin-shared/alphabetical-search/alphabetical-search';
import { LoggerService } from '@app/services/logger.service';

@Component({
  selector: 'csbc-admin-users-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    AlphabeticalSearch,
  ],
  templateUrl: './admin-users-list.html',
  styleUrls: ['./admin-users-list.scss', '../../../shared/scss/tables.scss'],
})
export class AdminUsersList implements OnInit, AfterViewInit {
  private usersService = inject(AdminUsersService);
  private readonly logger = inject(LoggerService);
  private router = inject(Router);
  selectedLetter = model<string>('A');
  displayedColumns: string[] = ['userName', 'name', 'userType'];
  dataSource = new MatTableDataSource<User>([]);
  pageSizeOptions = [5, 10, 25];
  pageSize = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor() {
    // Reactively update table when users list changes
    effect(() => {
      const users = this.usersService.users();
      const mapped = users.map((u) => ({
        ...u,
        firstName: u.firstName ?? '',
        lastName: u.lastName ?? '',
      }));
      this.dataSource.data = mapped;
    });
    effect(() => {
      const letter = this.selectedLetter();
      this.logger.info('Selected letter changed:', letter);
      // Update criteria when letter changes
      //this.usersService.updateSelectedCriteria({
    });
  }
  ngOnInit(): void {
    // Kick off load using signals API
    this.usersService.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
