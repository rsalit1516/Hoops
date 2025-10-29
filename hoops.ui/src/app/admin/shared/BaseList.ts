import { inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// base-list.component.ts
export abstract class BaseList<T extends { id: string | number }> {
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);

  items = signal<T[]>([]);
  loading = signal(false);

  abstract get basePath(): string;

  navigateToDetail(item: T): void {
    this.router.navigate([item.id], { relativeTo: this.route });
  }

  navigateToNew(): void {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  navigateBack(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
