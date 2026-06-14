import {
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
  ChangeDetectionStrategy,
} from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { Color } from '@app/domain/color';
import { ColorService } from '../../admin-shared/services/color.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-color-detail',
  templateUrl: './color-detail.html',
  styleUrls: [
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
  ],
  imports: [
    FormField,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class ColorDetail {
  readonly #colorService = inject(ColorService);
  readonly #notify = inject(NotificationService);

  colorFormModel = signal({
    colorName: '',
    discontinued: false,
  });

  colorForm = form(this.colorFormModel);

  isColorNameEmpty = computed(() => {
    const val = this.colorForm.colorName().value();
    return !val || val.trim() === '';
  });

  isExistingColor = computed(() => (this.#colorService.selectedColor()?.colorId ?? 0) > 0);

  isFormActuallyChanged = computed(() => {
    const original = this.#colorService.selectedColor();
    if (!original) return false;
    return (
      this.colorForm.colorName().value() !== (original.colorName ?? '') ||
      this.colorForm.discontinued().value() !== (original.discontinued ?? false)
    );
  });

  isSaveEnabled = computed(
    () => !this.isColorNameEmpty() && (!this.isExistingColor() || this.isFormActuallyChanged())
  );

  constructor() {
    effect(() => {
      const color = this.#colorService.selectedColor();
      untracked(() => {
        this.colorForm.colorName().value.set(color?.colorName ?? '');
        this.colorForm.discontinued().value.set(color?.discontinued ?? false);
      });
    });
  }

  onDiscontinuedChange(checked: boolean): void {
    this.colorForm.discontinued().value.set(checked);
  }

  save(): void {
    if (!this.isSaveEnabled()) return;

    const current = this.#colorService.selectedColor();
    const color: Color = {
      ...(current ?? new Color()),
      colorName: this.colorForm.colorName().value()?.trim() ?? '',
      discontinued: this.colorForm.discontinued().value(),
    };

    this.#colorService.saveColor(color).subscribe({
      next: () => this.#notify.success('Color saved'),
      error: () => this.#notify.error('Failed to save color'),
    });
  }

  cancel(): void {
    const original = this.#colorService.selectedColor();
    untracked(() => {
      this.colorForm.colorName().value.set(original?.colorName ?? '');
      this.colorForm.discontinued().value.set(original?.discontinued ?? false);
    });
    if (!original?.colorId) {
      this.#colorService.setSelectedColor(null);
    }
  }

  discontinue(): void {
    const current = this.#colorService.selectedColor();
    if (!current?.colorId) return;

    const discontinued: Color = { ...current, discontinued: true };
    this.#colorService.saveColor(discontinued).subscribe({
      next: () => {
        this.#notify.success('Color discontinued');
        this.#colorService.setSelectedColor(null);
      },
      error: () => this.#notify.error('Failed to discontinue color'),
    });
  }
}
