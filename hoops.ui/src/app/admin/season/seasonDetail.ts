import { Component, OnInit, input } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';

import { Season } from '../../domain/season';
import { NgClass } from '@angular/common';

@Component({
    selector: 'csbc-season-detail',
    templateUrl: "./seasonDetail.html",
    imports: [FormsModule, ReactiveFormsModule, NgClass]
})

export class SeasonDetail implements OnInit {
    season: Season = new Season();
    seasonForm!: FormGroup;

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
        this.seasonForm = this.fb.group({
            // id: this.season.id,
            name: this.season?.description,
            startDate: this.season?.fromDate,
            endDate: this.season?.toDate,
            currentSeason: false
        });
    }

    save() {

    }
}
