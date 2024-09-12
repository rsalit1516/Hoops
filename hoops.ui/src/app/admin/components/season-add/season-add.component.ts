import { Component, inject } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { SeasonService } from '@app/services/season.service';

@Component({
  selector: 'app-season-add',
  standalone: true,
  imports: [],
  templateUrl: './season-add.component.html',
  styleUrls: ['../../../shared/scss/forms.scss',
    './season-add.component.scss'
  ]
})
export class SeasonAddComponent {
  title = 'Season';
  seasonService  = inject(SeasonService);
  form: any;
  constructor (private fb: UntypedFormBuilder) {

    // console.log(this.seasonService.getCurrentDivision());
    // this.division = this.divisionService.getCurrentDivision();
    this.form = this.fb.group({
      name: ['', Validators.required], //this.division.divisionDescription,
            seasonId: [''], //this.division.seasonId,
      divisionId: [''], //this.division.seasonId,
    }); }
}
