import { Directive, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import { LoggerService } from '@app/services/logger.service';

// base-detail.component.ts
@Directive()
export abstract class BaseDetail<T> {
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);
  protected logger = inject(LoggerService);

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
    this.logger.debug('BaseDetail.onSave called with:', item);
    try {
      this.logger.debug('Calling saveItem...');
      const saved = await firstValueFrom(this.saveItem(item));
      this.logger.info('Save successful:', saved);
      this.navigateToList();
    } catch (error) {
      this.logger.error('Save failed:', error);
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
    this.logger.debug('BaseDetail.onDelete called with:', item);

    // Confirm deletion
    if (!confirm('Are you sure you want to delete this record?')) {
      return;
    }

    try {
      this.logger.debug('Calling deleteItem...');
      await firstValueFrom(this.deleteItem(item));
      this.logger.info('Delete successful');
      this.navigateToList();
    } catch (error) {
      this.logger.error('Delete failed:', error);
      // Handle error
    }
  }
}
