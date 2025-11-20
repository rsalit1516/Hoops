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
  protected abstract deleteItem(item: T): Observable<T>;
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
    console.log('BaseDetail.onSave called with:', item);
    try {
      console.log('Calling saveItem...');
      const saved = await firstValueFrom(this.saveItem(item));
      console.log('Save successful:', saved);
      this.navigateToList();
    } catch (error) {
      console.error('Save failed:', error);
      // Handle error
    }
  }

  navigateToList(): void {
    this.router.navigate([this.getBasePath()]);
  }

  onCancel(): void {
    this.navigateToList();
  }

  async onDelete(item: T): Promise<void> {
    console.log('BaseDetail.onDelete called with:', item);

    // Confirm deletion
    if (!confirm('Are you sure you want to delete this record?')) {
      return;
    }

    try {
      console.log('Calling deleteItem...');
      await firstValueFrom(this.deleteItem(item));
      console.log('Delete successful');
      this.navigateToList();
    } catch (error) {
      console.error('Delete failed:', error);
      // Handle error
    }
  }
}
