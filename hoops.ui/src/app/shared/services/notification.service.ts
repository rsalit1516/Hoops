import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  #snackBar = inject(MatSnackBar);
  #duration = 3000;

  show(message: string, panelClass: string | string[] = []) {
    this.#snackBar.open(message, 'Close', {
      duration: this.#duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass,
    });
  }

  success(message: string) {
    this.show(message, ['snack-success']);
  }
  error(message: string) {
    this.show(message, ['snack-error']);
  }
  info(message: string) {
    this.show(message, ['snack-info']);
  }
  warn(message: string) {
    this.show(message, ['snack-warn']);
  }
}
