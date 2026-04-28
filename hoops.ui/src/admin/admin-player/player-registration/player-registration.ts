import { Component, computed, effect, inject, OnInit, signal, viewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Player } from '@app/domain/player';
import { Season } from '@app/domain/season';
import { Division } from '@app/domain/division';
import { PlayerService } from '../player.service';
import { PeopleService } from '@app/services/people.service';
import { SeasonService } from '@app/services/season.service';
import { DivisionService } from '@app/services/division.service';
import { HouseholdService } from '@app/services/household.service';
import { FormSettings } from '@app/shared/constants';
import { LoggerService } from '@app/services/logger.service';
import { RegistrationHouseholdForm } from './registration-household-form/registration-household-form';
import { RegistrationPersonPhoneForm } from './registration-person-phone-form/registration-person-phone-form';
import { HasUnsavedChanges } from '@app/admin/admin-games/pending-changes.guard';

// Player registration form data interface
interface PlayerFormData {
  playerId: number;
  personId: number;
  seasonId: number | null;
  playerName: string;
  divisionId: number | null;

  // Payment Info
  payType: string;
  paidAmount: number | null;
  balanceOwed: number | null;
  checkMemo: string;
  paidDate: Date | null;
  noteDesc: string;

  // Draft Info
  draftId: string;
  draftNotes: string;
  rating: number | null;
  changeDivision: string;

  // Fee Waived
  scholarship: boolean;
  rollover: boolean;
  familyDisc: boolean;
  ad: boolean;
  outOfTown: boolean;
}

@Component({
  selector: 'csbc-player-registration',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    RouterModule,
    RegistrationHouseholdForm,
    RegistrationPersonPhoneForm,
  ],
  templateUrl: './player-registration.html',
  styleUrls: [
    './player-registration.scss',
    '../../admin.scss',
    '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
  ],
  providers: [provideNativeDateAdapter()],
})
export class PlayerRegistration implements OnInit, HasUnsavedChanges {
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly playerService = inject(PlayerService);
  private readonly peopleService = inject(PeopleService);
  private readonly seasonService = inject(SeasonService);
  private readonly divisionService = inject(DivisionService);
  private readonly householdService = inject(HouseholdService);
  private logger = inject(LoggerService);
  private snackBar = inject(MatSnackBar);

  pageTitle = 'Player Registration';
  inputStyle = FormSettings.inputStyle;

  // Signals
  person = this.peopleService.selectedPerson;
  player = this.playerService.selectedPlayer;
  seasons = signal<Season[]>([]);
  divisions = signal<Division[]>([]);
  selectedSeason = signal<Season | undefined>(undefined);

  // Options for dropdowns
  paymentTypes = ['Check', 'Credit Card', 'Online', 'Cash', 'Zelle'];
  ratingOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  changeDivisionOptions = ['N/A', 'Plays Up', 'Plays Down'];

  // Sub-form refs for cross-form dirty check
  private readonly householdFormRef = viewChild(RegistrationHouseholdForm);
  private readonly personPhoneFormRef = viewChild(RegistrationPersonPhoneForm);

  isFormDirty(): boolean {
    return (
      this.isDirty() ||
      (this.householdFormRef()?.isDirty() ?? false) ||
      (this.personPhoneFormRef()?.isDirty() ?? false)
    );
  }

  // Dirty tracking
  private initialSnapshot = signal<PlayerFormData | null>(null);

  readonly isDirty = computed(() => {
    const initial = this.initialSnapshot();
    if (!initial) return false;
    const current = this.playerFormModel();
    const toISO = (v: Date | string | null | undefined): string | null =>
      v ? new Date(v).toISOString() : null;
    return (
      JSON.stringify({ ...current, paidDate: toISO(current.paidDate) }) !==
      JSON.stringify({ ...initial, paidDate: toISO(initial.paidDate) })
    );
  });

  readonly canSave = computed(() => {
    const model = this.playerFormModel();
    if (model.playerId === 0) return model.seasonId !== null;
    return this.isDirty();
  });

  // Signal-based form model
  playerFormModel = signal<PlayerFormData>({
    playerId: 0,
    personId: 0,
    seasonId: null,
    playerName: '',
    divisionId: null,

    // Payment Info
    payType: '',
    paidAmount: null,
    balanceOwed: null,
    checkMemo: '',
    paidDate: null,
    noteDesc: '',

    // Draft Info
    draftId: '',
    draftNotes: '',
    rating: null,
    changeDivision: 'N/A',

    // Fee Waived
    scholarship: false,
    rollover: false,
    familyDisc: false,
    ad: false,
    outOfTown: false,
  });

  constructor() {
    effect(() => {
      const currentPerson = this.person();
      this.logger.debug(
        'Person changed in player registration:',
        currentPerson,
      );
      if (currentPerson?.houseId) {
        this.householdService.selectedHouseholdByHouseId(currentPerson.houseId);
      }
    });

    effect(() => {
      const selectedSeason = this.seasonService.selectedSeason();
      this.logger.debug('Selected season changed:', selectedSeason);
      if (selectedSeason?.seasonId) {
        this.selectedSeason.set(selectedSeason);
        this.loadDivisionsForSeason(selectedSeason.seasonId);
      }
    });

    effect(() => {
      const divs = this.divisionService.seasonDivisions();
      this.logger.debug('Divisions changed:', divs);
      if (divs) {
        this.divisions.set(divs);

        // If this is a new registration (no divisionId yet), try to set default
        const formModel = this.playerFormModel();
        if (!formModel.divisionId && formModel.personId) {
          const currentPerson = this.person();
          if (currentPerson?.birthDate && currentPerson?.gender) {
            const eligibleDivision = this.divisionService.findEligibleDivision(
              currentPerson.birthDate,
              currentPerson.gender,
              divs,
            );
            if (eligibleDivision) {
              this.updateFormField('divisionId', eligibleDivision.divisionId);
              this.logger.info(
                'Auto-selected division on load:',
                eligibleDivision.divisionDescription,
              );
            }
          }
        }
      }
    });

    // Listen for season changes in form model
    effect(() => {
      const seasonId = this.playerFormModel().seasonId;
      if (seasonId) {
        const season = this.seasons().find((s) => s.seasonId === seasonId);
        if (season) {
          this.selectedSeason.set(season);
          this.seasonService.updateSelectedSeason(season);
          this.loadDivisionsForSeason(seasonId);
        }
      }
    });
  }

  private returnToPeople = false;

  ngOnInit(): void {
    this.loadSeasons();

    this.route.queryParams.subscribe((qp) => {
      this.returnToPeople = qp['from'] === 'people';
    });

    this.route.params.subscribe((params) => {
      const personId = params['personId'];
      if (personId) {
        this.loadPersonAndPlayer(+personId);
      }
    });
  }

  loadSeasons(): void {
    this.seasonService.fetchSeasons();
    this.seasons.set(this.seasonService.seasons);

    // Set default to current season
    const currentSeason = this.seasonService.selectedSeason();
    if (currentSeason) {
      const currentModel = this.playerFormModel();
      this.playerFormModel.set({
        ...currentModel,
        seasonId: currentSeason.seasonId ?? null,
      });
    }
  }

  loadDivisionsForSeason(seasonId: number): void {
    this.divisionService.getSeasonDivisions(seasonId);
  }

  loadPersonAndPlayer(personId: number): void {
    // Get the player name from the already-selected person
    const currentPerson = this.person();
    const playerName = currentPerson
      ? `${currentPerson.firstName} ${currentPerson.lastName}`
      : '';

    // Set personId in form model
    this.updateFormField('personId', personId);
    if (playerName) {
      this.updateFormField('playerName', playerName);
    }

    // Check if we already have a player for this person and season
    const seasonId = this.playerFormModel().seasonId;
    if (seasonId) {
      this.playerService
        .getPlayerByPersonAndSeason(personId, seasonId)
        .subscribe({
          next: (player) => {
            this.logger.info('Existing player found:', player);
            this.playerService.updateSelectedPlayer(player);
            this.patchFormWithPlayer(player, playerName);
          },
          error: (error) => {
            this.logger.info('No existing player, creating new registration');
            this.createNewPlayerRegistration(personId, playerName);
          },
        });
    } else {
      this.createNewPlayerRegistration(personId, playerName);
    }
  }

  createNewPlayerRegistration(personId: number, playerName: string): void {
    const seasonId =
      this.playerFormModel().seasonId || this.selectedSeason()?.seasonId;
    if (!seasonId) {
      this.logger.error('No season selected');
      return;
    }

    // Create a new player with default values
    const newPlayer = this.playerService.createNewPlayer(personId, seasonId);

    // Set the paid amount to the season's participation fee
    const season = this.seasons().find((s) => s.seasonId === seasonId);
    if (season && season.participationFee) {
      newPlayer.paidAmount = season.participationFee;
      newPlayer.balanceOwed = season.participationFee;
    }

    // Set default division based on person's birth date and gender
    const currentPerson = this.person();
    if (currentPerson?.birthDate && currentPerson?.gender) {
      const eligibleDivision = this.divisionService.findEligibleDivision(
        currentPerson.birthDate,
        currentPerson.gender,
        this.divisions(),
      );
      if (eligibleDivision) {
        newPlayer.divisionId = eligibleDivision.divisionId;
        this.logger.info(
          'Auto-selected division:',
          eligibleDivision.divisionDescription,
        );
      }
    }

    this.playerService.updateSelectedPlayer(newPlayer);
    this.patchFormWithPlayer(newPlayer, playerName);
  }

  patchFormWithPlayer(player: Player, playerName: string): void {
    console.log(
      'DEBUG: patchFormWithPlayer called with player:',
      player,
      'playerName:',
      playerName,
    );
    // Determine change division value based on playsUp/playsDown
    let changeDivision = 'N/A';
    if (player.playsUp) {
      changeDivision = 'Plays Up';
    } else if (player.playsDown) {
      changeDivision = 'Plays Down';
    }

    // Update the form model directly
    this.playerFormModel.set({
      playerId: player.playerId,
      personId: player.personId,
      seasonId: player.seasonId,
      divisionId: player.divisionId,
      playerName: playerName,

      // Payment Info
      payType: player.payType ?? '',
      paidAmount: player.paidAmount,
      balanceOwed: player.balanceOwed,
      checkMemo: player.checkMemo ?? '',
      paidDate: player.paidDate,
      noteDesc: player.noteDesc ?? '',

      // Draft Info
      draftId: player.draftId ?? '',
      draftNotes: player.draftNotes ?? '',
      rating: player.rating,
      changeDivision: changeDivision,

      // Fee Waived
      scholarship: player.scholarship ?? false,
      rollover: player.rollover ?? false,
      familyDisc: player.familyDisc ?? false,
      ad: player.ad ?? false,
      outOfTown: player.outOfTown ?? false,
    });

    this.playerService.updateFormDirtyState(false);
    this.initialSnapshot.set({ ...this.playerFormModel() });
  }

  onSubmit(): void {
    // Get current form values from the signal model
    const formValue = this.playerFormModel();

    this.logger.info('Submitting player registration form:', formValue);

    // Check if required fields are filled
    if (!formValue.seasonId) {
      this.logger.error('Form is invalid - season is required');
      this.snackBar.open('Please fill in all required fields', 'OK', {
        duration: 3000,
      });
      return;
    }

    // Check if personId is set in the form
    if (!formValue.personId) {
      this.logger.error('No person selected');
      this.snackBar.open('No person selected', 'OK', { duration: 3000 });
      return;
    }

    // Map form values to player object
    const player = new Player();

    player.playerId = formValue.playerId;
    player.personId = formValue.personId;
    player.seasonId = formValue.seasonId;
    player.divisionId = formValue.divisionId;

    // Payment Info
    player.payType = formValue.payType;
    player.paidAmount = formValue.paidAmount;
    player.balanceOwed = formValue.balanceOwed;
    player.checkMemo = formValue.checkMemo;
    player.paidDate = formValue.paidDate;
    player.noteDesc = formValue.noteDesc;

    // Draft Info
    player.draftId = formValue.draftId;
    player.draftNotes = formValue.draftNotes;
    player.rating = formValue.rating;

    // Set playsUp/playsDown based on changeDivision
    const changeDivision = formValue.changeDivision;
    player.playsUp = changeDivision === 'Plays Up';
    player.playsDown = changeDivision === 'Plays Down';

    // Fee Waived
    player.scholarship = formValue.scholarship;
    player.rollover = formValue.rollover;
    player.familyDisc = formValue.familyDisc;
    player.ad = formValue.ad;
    player.outOfTown = formValue.outOfTown;

    this.logger.info('Saving player:', player);
    console.log(
      'DEBUG: Full player object being sent:',
      JSON.stringify(player, null, 2),
    );

    // Call the backend to save
    this.playerService.savePlayer(player).subscribe({
      next: (response) => {
        this.logger.info('Player saved successfully:', response);
        this.playerService.updateSelectedPlayer(response);
        this.playerService.updateFormDirtyState(false);
        this.initialSnapshot.set({ ...this.playerFormModel() });

        this.snackBar.open('Player registration saved successfully', 'OK', {
          duration: 3000,
        });

        if (this.returnToPeople) {
          this.router.navigate(['/admin/people']);
        } else {
          this.location.back();
        }
      },
      error: (error) => {
        this.logger.error('Error saving player:', error);
        console.log('DEBUG: Error details:', error);
        if (error.error) {
          console.log('DEBUG: Error body:', error.error);
        }
        this.snackBar.open('Error saving player registration', 'OK', {
          duration: 5000,
        });
      },
      complete: () => {
        this.playerService.updateLoadingState(false);
      },
    });
  }

  onCancel(): void {
    if (this.returnToPeople) {
      this.router.navigate(['/admin/people']);
    } else {
      this.location.back();
    }
  }

  /**
   * Updates a single field in the form model.
   * This ensures the signal is properly updated rather than just mutating the object.
   */
  updateFormField<K extends keyof PlayerFormData>(
    field: K,
    value: PlayerFormData[K],
  ): void {
    const currentModel = this.playerFormModel();
    this.playerFormModel.set({
      ...currentModel,
      [field]: value,
    });
  }
}
