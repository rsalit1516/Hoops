import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-admin-seasons-toolbar',
  standalone: true,
  imports: [],
  templateUrl: './admin-seasons-toolbar.component.html',
  styleUrl: './admin-seasons-toolbar.component.scss'
})
export class AdminSeasonsToolbarComponent implements OnInit {
    checked = true;
        filterForm = this.fb.group({
      activeContent: true
    });


    constructor(
      private router: Router,
      // private store: Store<fromContent.State>,
      private fb: UntypedFormBuilder
    ) {

    }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
