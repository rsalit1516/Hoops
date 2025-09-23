import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from '@app/shared/constants';
import { User } from '@app/domain/user';

@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  private http = inject(HttpClient);
  private baseUrl = `${Constants.FUNCTIONS_BASE_URL}/api/user`;

  // Signals-based state
  readonly users = signal<User[]>([]);
  readonly selectedUser = signal<User | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  updateUser(user: User): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${user.userId}`, user);
  }

  // Signal-friendly methods
  loadUsers(): void {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<User[]>(this.baseUrl).subscribe({
      next: (list) => {
        this.users.set(list ?? []);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(typeof err === 'string' ? err : 'Failed to load users');
      },
    });
  }

  loadUser(id: number): void {
    if (!id) {
      this.selectedUser.set(null);
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.http.get<User>(`${this.baseUrl}/${id}`).subscribe({
      next: (u) => {
        this.selectedUser.set(u ?? null);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(typeof err === 'string' ? err : 'Failed to load user');
      },
    });
  }
}
