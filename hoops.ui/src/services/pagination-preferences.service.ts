import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PaginationPreferencesService {
  private readonly key = 'hoops.pageSize';

  getPageSize(fallback = 10, key = this.key): number {
    const stored = localStorage.getItem(key);
    return stored ? +stored : fallback;
  }

  savePageSize(size: number, key = this.key): void {
    localStorage.setItem(key, String(size));
  }
}
