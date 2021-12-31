import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as adminActions from '../../state/admin.actions';
import * as contentActions from '../../content/state/content.actions';
import * as fromAdmin from '../../state';
import * as fromUser from '../../../user/state';


@Component({
  selector: 'csbc-admin-shell',
  templateUrl: './admin-shell.component.html',
  styleUrls: ['./admin-shell.component.scss']
})
export class AdminShellComponent implements OnInit {
  events: string[] = [];
  opened: boolean;

  shouldRun = true;
  
  constructor(private store: Store<fromAdmin.State>) { }

  ngOnInit() {
    this.store.dispatch(new contentActions.Load());
    this.store.dispatch(new adminActions.LoadSeasons);
  }

}
