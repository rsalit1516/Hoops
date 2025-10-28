import { Observable } from 'rxjs';

// base-list-detail.component.ts
export abstract class BaseListDetailComponent<T> {
  items: T[] = [];
  selectedItem?: T;
  filters: any = {};

  abstract loadItems(): Observable<T[]>;
  abstract saveItem(item: T): Observable<T>;

  // Common filtering, pagination logic here
}
