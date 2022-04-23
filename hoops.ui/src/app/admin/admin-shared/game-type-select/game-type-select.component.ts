import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromAdmin from '../../state';
import * as adminActions from '../../state/admin.actions';

@Component({
  selector: 'game-type-select',
  templateUrl: './game-type-select.component.html',
  styleUrls: [
    './game-type-select.component.scss',
    '../../admin.component.scss',
  ],
})
export class GameTypeSelectComponent implements OnInit {
  selectForm!: FormGroup;
  gameTypes = ['Regular Season', 'Playoffs'];
  gameTypeComponent: FormControl | null | undefined;
  selected = this.gameTypes[0];
  selectedType = this.gameTypes[0];

  constructor(private fb: FormBuilder, private store: Store<fromAdmin.State>) {}

  ngOnInit(): void {
    this.gameTypeComponent = this.selectForm.get('gameType') as FormControl;
    this.selectForm = this.fb.group({
      gametType: ['Playoffs'],
    });

    this.gameTypeComponent?.setValue(this.selected);
    this.gameTypeComponent.valueChanges.subscribe((value) => {
      console.log(value);
      this.store.dispatch(new adminActions.SetSelectedDivision(value));
    });
  }
}
