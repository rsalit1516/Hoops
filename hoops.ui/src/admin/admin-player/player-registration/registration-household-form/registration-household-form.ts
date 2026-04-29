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
import { Household } from '@app/domain/household';
import { HouseholdService } from '@app/services/household.service';

interface HouseholdFormModel {
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
}

@Component({
  selector: 'csbc-registration-household-form',
  standalone: true,
  imports: [
    FormField,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './registration-household-form.html',
  styleUrls: [
    './registration-household-form.scss',
    '../../../admin.scss',
    '../../../../shared/scss/forms.scss',
    '../../../../shared/scss/cards.scss',
  ],
})
export class RegistrationHouseholdForm {
  private static readonly PANEL_STATE_KEY =
    'csbc.registrationHouseholdForm.expanded';

  private readonly householdService = inject(HouseholdService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  readonly household = this.householdService.selectedRecordSignal;
  readonly isSaving = signal(false);
  readonly panelExpanded = signal(this.loadPanelExpanded());

  readonly model = signal<HouseholdFormModel>({
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
  });

  readonly householdForm = form(this.model);
  private readonly initialSnapshot = signal<HouseholdFormModel | null>(null);
  // Track which houseId we last populated so we don't overwrite user edits on
  // background re-fetches of the same household.
  private readonly populatedHouseId = signal<number | null>(null);

  readonly isDirty = computed(() => {
    const initial = this.initialSnapshot();
    if (!initial) return false;
    const current = this.model();
    return JSON.stringify(current) !== JSON.stringify(initial);
  });

  readonly canSave = computed(() => this.isDirty() && !this.isSaving());

  constructor() {
    effect(() => {
      const hh = this.household();
      if (!hh) return;
      if (hh.houseId === untracked(() => this.populatedHouseId())) return;

      const snap: HouseholdFormModel = {
        address1: hh.address1 ?? '',
        address2: hh.address2 ?? '',
        city: hh.city ?? '',
        state: hh.state ?? 'FL',
        zip: hh.zip ?? '',
        phone: hh.phone ?? '',
        email: hh.email ?? '',
      };
      this.model.set({ ...snap });
      this.initialSnapshot.set({ ...snap });
      this.populatedHouseId.set(hh.houseId);
    });
  }

  save(): void {
    const hh = this.household();
    if (!hh) return;
    const current = this.model();
    const updated: Household = {
      ...hh,
      address1: current.address1,
      address2: current.address2,
      city: current.city,
      state: current.state,
      zip: current.zip,
      phone: current.phone,
      email: current.email,
    };
    this.isSaving.set(true);
    this.householdService.saveHousehold(updated).subscribe({
      next: () => {
        // Push updated record back into the service signal so any navigation
        // to the household detail page sees the updated data. We use our local
        // `updated` object rather than the server response because the PUT
        // may return 204 No Content (null), which would wipe the signal.
        // The populatedHouseId guard in the effect prevents re-populating
        // the form since houseId hasn't changed.
        this.householdService.updateSelectedHousehold(updated);
        this.initialSnapshot.set({ ...current });
        this.snackBar.open('Household saved', 'OK', { duration: 3000 });
      },
      error: () =>
        this.snackBar.open('Error saving household', 'OK', { duration: 5000 }),
      complete: () => this.isSaving.set(false),
    });
  }

  cancel(): void {
    const initial = this.initialSnapshot();
    if (initial) this.model.set({ ...initial });
  }

  navigateToHousehold(event: Event): void {
    event.stopPropagation();
    if (!this.isDirty()) {
      this.router.navigate(['/admin/households/detail']);
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
        RegistrationHouseholdForm.PANEL_STATE_KEY,
      );
      return value === null ? true : value === 'true';
    } catch {
      return true;
    }
  }

  private savePanelExpanded(expanded: boolean): void {
    try {
      localStorage.setItem(
        RegistrationHouseholdForm.PANEL_STATE_KEY,
        String(expanded),
      );
    } catch {
      // Ignore storage failures and keep in-memory state.
    }
  }
}
