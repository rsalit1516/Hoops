import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';

import { Season } from '../../domain/season';

@Component({
    selector: 'csbc-season-detail',
    templateUrl: './seasonDetail.component.html'
})

export class SeasonDetailComponent implements OnInit {
    @Input() season: Season;
    seasonForm: UntypedFormGroup;

    constructor(private fb: UntypedFormBuilder) { }
    
    ngOnInit(): void {
        this.seasonForm = this.fb.group({
            // id: this.season.id,
            name: this.season.description,
            startDate: this.season.fromDate,
            endDate: this.season.toDate,
            currentSeason: false
        });
    }

    save() {
        
    }
}