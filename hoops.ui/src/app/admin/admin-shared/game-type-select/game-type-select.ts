import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  OnChanges,
  inject,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromAdmin from '../../state';
import * as adminActions from '../../state/admin.actions';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AdminGameService } from '@app/admin/admin-games/adminGame.service';
import { AdminGamesState } from '@app/admin/admin-games/adminGamesState.service';
import { LoggerService } from '@app/services/logger.service';

@Component({
  selector: 'game-type-select',
  template: `
    <mat-button-toggle-group
      [value]="state.gameType()"
      (change)="state.setGameType($event.value)"
      aria-label="Game type"
    >
      <mat-button-toggle value="regular">Regular</mat-button-toggle>
      <mat-button-toggle value="playoff">Playoffs</mat-button-toggle>
    </mat-button-toggle-group>
  `,
  styleUrls: [
    './../../../shared/scss/select.scss',
    '../../../shared/scss/forms.scss',
  ],
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatButtonToggleModule,
    MatOptionModule
],
})
export class GameTypeSelect implements OnInit {
  private gameService = inject(AdminGameService);
  state = inject(AdminGamesState);
  private logger = inject(LoggerService);
  gameTypes = ['Regular Season', 'Playoffs'];
  gameTypeComponent = new UntypedFormControl();
  selected = this.gameTypes[0];
  selectedType = this.gameTypes[0];
  gameType: string;
  @Output() gameTypeChanged = new EventEmitter<string>();

  constructor() {
    this.gameType = this.selectedType;
  }

  ngOnInit(): void {
    // this.gameTypeComponent = this.selectForm.get('gameType') as FormControl;
    // this.selectForm = this.fb.group({
    //   gametType: ['Playoffs'],
    // });
    // this.gameTypeComponent?.setValue(this.selected);
    // this.gameTypeComponent.valueChanges.subscribe((value) => {
    //   console.log(value);
    //   this.store.dispatch(new adminActions.SetGameType(value));
    // });
  }

  changeGameType(value: string) {
    this.logger.debug('Game type changed:', value);
  }

  compareFn(c1: string, c2: string): boolean {
    this.logger.debug('Comparing game types:', c1, c2);
    return c1 && c2 ? c1 === c2 : c1 === c2;
  }
  onChange(gameType: string) {
    this.logger.info('Game type changed:', gameType);
    this.gameTypeChanged.emit(gameType);
    // this.gameService.setGameType(gameType);
  }
}
