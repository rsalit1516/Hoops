import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromAdmin from '../../state';
import { Observable } from 'rxjs';
import { Season } from 'app/domain/season';
import * as adminActions from '../../state/admin.actions';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'season-select',
  templateUrl: './season-select.component.html',
  styleUrls: ['./season-select.component.scss', '../../admin.component.scss']
})
export class SeasonSelectComponent implements OnInit {
  seasons$: Observable<Season[]>;
  selectForm: FormGroup;

  constructor( private store: Store<fromAdmin.State>, private fb: FormBuilder
    ) {}

  ngOnInit() {
    this.seasons$ = this.store.select(fromAdmin.getSeasons);
    
    this.selectForm = this.fb.group({
      description: ''
  });

  }
  selectedSeason(season: Season) {
    console.log(season);
    this.store.dispatch(new adminActions.SetSelectedSeason(season));
    this.store.dispatch(new adminActions.SetSelectedSeasonId(season.seasonID));
  }
}
