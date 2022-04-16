import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'game-type-select',
  templateUrl: './game-type-select.component.html',
  styleUrls: ['./game-type-select.component.scss', '../../admin.component.scss']
})
export class GameTypeSelectComponent implements OnInit {
  selectForm!: FormGroup;
  gameTypes = ['Regular Season', 'Playoffs'];

  constructor(private fb: FormBuilder) {
    this.selectForm = this.fb.group({
      division: new FormControl(''),
    });
  }

  ngOnInit(): void {
  }

}
