import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PaginationPreferencesService {
  private readonly key = 'hoops.pageSize';

  getPageSize(fallback = 10): number {
    const stored = localStorage.getItem(this.key);
    return stored ? +stored : fallback;
  }

  savePageSize(size: number): void {
    localStorage.setItem(this.key, String(size));
  }
}
