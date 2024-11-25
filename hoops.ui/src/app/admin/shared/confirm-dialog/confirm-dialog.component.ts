import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  imports: [
    CommonModule,
    MatButtonModule
  ]
})
export class ConfirmDialogComponent {
  constructor (public dialogRef: MatDialogRef<ConfirmDialogComponent>) { }

  onNoClick (): void {
    this.dialogRef.close(false);
  }

  onYesClick (): void {
    this.dialogRef.close(true);
  }
}
