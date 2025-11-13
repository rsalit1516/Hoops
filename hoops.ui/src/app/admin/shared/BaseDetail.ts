import { Directive, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';

// base-detail.component.ts
@Directive()
export abstract class BaseDetail<T> {
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);

  item = signal<T | undefined>(undefined);
  mode = signal<'create' | 'edit'>('edit');

  protected abstract getBasePath(): string;
  protected abstract saveItem(item: T): Observable<T>;
  protected abstract createNew(): T;

  ngOnInit() {
    // Get mode from route data
    this.mode.set(this.route.snapshot.data['mode'] || 'edit');

    // Get item from resolver or create new
    const resolvedItem = this.route.snapshot.data['item'];
    if (resolvedItem) {
      this.item.set(resolvedItem);
    } else if (this.mode() === 'create') {
      this.item.set(this.createNew());
    }
  }

  async onSave(item: T): Promise<void> {
    try {
      const saved = await firstValueFrom(this.saveItem(item));
      this.navigateToList();
    } catch (error) {
      // Handle error
    }
  }

  navigateToList(): void {
    this.router.navigate([this.getBasePath()]);
  }

  onCancel(): void {
    this.navigateToList();
  }
}
