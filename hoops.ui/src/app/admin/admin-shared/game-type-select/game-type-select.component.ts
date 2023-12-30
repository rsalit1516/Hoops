import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromAdmin from '../../state';
import * as adminActions from '../../state/admin.actions';
import { MatOptionModule } from '@angular/material/core';
import { NgFor } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'game-type-select',
    templateUrl: './game-type-select.component.html',
    styleUrls: [
        './game-type-select.component.scss',
        '../../admin.component.scss',
    ],
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        NgFor,
        MatOptionModule,
    ],
})
export class GameTypeSelectComponent implements OnInit {
  selectForm!: UntypedFormGroup;
  gameTypes = ['Regular Season', 'Playoffs'];
  gameTypeComponent = new UntypedFormControl();
  selected = this.gameTypes[0];
  selectedType = this.gameTypes[0];
  gameType: string;

  constructor(private fb: UntypedFormBuilder, private store: Store<fromAdmin.State>) {
    this.gameType = this.selectedType;
  }

  ngOnInit(): void {
    // this.gameTypeComponent = this.selectForm.get('gameType') as FormControl;
    // this.selectForm = this.fb.group({
    //   gametType: ['Playoffs'],
    // });

    this.gameTypeComponent?.setValue(this.selected);
    this.gameTypeComponent.valueChanges.subscribe((value) => {
      console.log(value);
      this.store.dispatch(new adminActions.SetGameType(value));
    });
  }

  changeGameType(value: string) {
    console.log(value);
  }

  compareFn(c1: string, c2: string): boolean {
    console.log(c1);
    console.log(c2);
    return c1 && c2 ? c1 === c2 : c1 === c2;
  }
}
