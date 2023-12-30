import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Season } from '../../domain/season';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { NgClass } from '@angular/common';

@Component({
    selector: 'csbc-season-detail',
    templateUrl: './seasonDetail.component.html',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgClass, ExtendedModule]
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