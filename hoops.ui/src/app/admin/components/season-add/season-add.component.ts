import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SeasonService } from '@app/services/season.service';

@Component({
  selector: 'app-season-add',
  standalone: true,
  imports: [ CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule
  ],
  providers: [SeasonService],
  templateUrl: './season-add.component.html',
  styleUrls: [ '../../../shared/scss/forms.scss',
    '../../../shared/scss/cards.scss',
    './season-add.component.scss'
  ]
})
export class SeasonAddComponent {
  title = 'Season';
  seasonService  = inject(SeasonService);
  form: any;
  constructor (private fb: UntypedFormBuilder) {

    this.form = this.fb.group({
      name: ['', Validators.required], //this.division.divisionDescription,
            seasonId: [''], //this.division.seasonId,
      divisionId: [''], //this.division.seasonId,
    }); }
  save() { }
}
