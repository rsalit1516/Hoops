import {
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Person } from '@app/domain/person';
import { PeopleService } from '@app/services/people.service';

interface PersonPhoneFormModel {
  cellphone: string;
  workphone: string;
}

@Component({
  selector: 'csbc-registration-person-phone-form',
  standalone: true,
  imports: [
    FormField,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './registration-person-phone-form.html',
  styleUrls: [
    './registration-person-phone-form.scss',
    '../../../admin.scss',
    '../../../../shared/scss/forms.scss',
    '../../../../shared/scss/cards.scss',
  ],
})
export class RegistrationPersonPhoneForm {
  private static readonly PANEL_STATE_KEY =
    'csbc.registrationPersonPhoneForm.expanded';

  private readonly peopleService = inject(PeopleService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  readonly person = this.peopleService.selectedPerson;
  readonly isSaving = signal(false);
  readonly panelExpanded = signal(this.loadPanelExpanded());

  readonly model = signal<PersonPhoneFormModel>({
    cellphone: '',
    workphone: '',
  });

  readonly personPhoneForm = form(this.model);
  private readonly initialSnapshot = signal<PersonPhoneFormModel | null>(null);
  // Track which personId we last populated to avoid overwriting edits on re-fetches.
  private readonly populatedPersonId = signal<number | null>(null);

  readonly isDirty = computed(() => {
    const initial = this.initialSnapshot();
    if (!initial) return false;
    const current = this.model();
    return (
      current.cellphone !== initial.cellphone ||
      current.workphone !== initial.workphone
    );
  });

  readonly canSave = computed(() => this.isDirty() && !this.isSaving());

  constructor() {
    effect(() => {
      const p = this.person();
      if (!p) return;
      if (p.personId === untracked(() => this.populatedPersonId())) return;

      const snap: PersonPhoneFormModel = {
        cellphone: p.cellphone ?? '',
        workphone: p.workphone ?? '',
      };
      this.model.set({ ...snap });
      this.initialSnapshot.set({ ...snap });
      this.populatedPersonId.set(p.personId);
    });
  }

  save(): void {
    const person = this.person();
    if (!person) return;
    const current = this.model();
    const updated: Person = {
      ...person,
      cellphone: current.cellphone,
      workphone: current.workphone,
    };
    this.isSaving.set(true);
    this.peopleService.savePerson(updated).subscribe({
      next: (saved) => {
        this.peopleService.updateSelectedPerson(saved);
        this.initialSnapshot.set({ ...current });
        this.snackBar.open('Contact info saved', 'OK', { duration: 3000 });
      },
      error: () =>
        this.snackBar.open('Error saving contact info', 'OK', {
          duration: 5000,
        }),
      complete: () => this.isSaving.set(false),
    });
  }

  cancel(): void {
    const initial = this.initialSnapshot();
    if (initial) this.model.set({ ...initial });
  }

  navigateToPerson(event: Event): void {
    event.stopPropagation();
    if (!this.isDirty()) {
      this.router.navigate(['/admin/people/detail']);
    }
  }

  onPanelOpened(): void {
    this.panelExpanded.set(true);
    this.savePanelExpanded(true);
  }

  onPanelClosed(): void {
    this.panelExpanded.set(false);
    this.savePanelExpanded(false);
  }

  private loadPanelExpanded(): boolean {
    try {
      const value = localStorage.getItem(
        RegistrationPersonPhoneForm.PANEL_STATE_KEY,
      );
      return value === null ? true : value === 'true';
    } catch {
      return true;
    }
  }

  private savePanelExpanded(expanded: boolean): void {
    try {
      localStorage.setItem(
        RegistrationPersonPhoneForm.PANEL_STATE_KEY,
        String(expanded),
      );
    } catch {
      // Ignore storage failures and keep in-memory state.
    }
  }
}
