import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-admin-seasons-toolbar',
  standalone: true,
  imports: [MatFormFieldModule, ReactiveFormsModule, MatButtonModule, MatToolbarModule, MatCheckboxModule ],
  templateUrl: './admin-seasons-toolbar.component.html',
  styleUrls: [
    './../../../shared/scss/forms.scss',
    './../../admin.component.scss',
    './admin-seasons-toolbar.component.scss']
})
export class AdminSeasonsToolbarComponent implements OnInit {
    checked = true;
        filterForm = this.fb.group({
      activeContent: true
    });
  title = 'Seasons List';

    constructor(
      private router: Router,
      // private store: Store<fromContent.State>,
      private fb: UntypedFormBuilder
    ) {

    }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  addContent() {

}
}