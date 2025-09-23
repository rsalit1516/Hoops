import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { User } from '@app/domain/user';
import { AdminUsersService } from '../admin-users.service';

@Component({
  selector: 'csbc-admin-users-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
  ],
  templateUrl: './admin-users-list.html',
  styleUrls: ['./admin-users-list.scss', '../../../shared/scss/tables.scss'],
})
export class AdminUsersList implements OnInit, AfterViewInit {
  private usersService = inject(AdminUsersService);

  displayedColumns: string[] = ['userName', 'name', 'userType'];
  dataSource = new MatTableDataSource<User>([]);
  pageSizeOptions = [5, 10, 25];
  pageSize = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.usersService.getUsers().subscribe((users) => {
      // map to include a computed name field for display
      const mapped = users.map((u) => ({
        ...u,
        // For template convenience, ensure first/last names are handled
        firstName: u.firstName ?? '',
        lastName: u.lastName ?? '',
      }));
      this.dataSource.data = mapped;
    });
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
}
