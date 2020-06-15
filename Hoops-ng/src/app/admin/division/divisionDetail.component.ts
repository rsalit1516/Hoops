import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Season } from '../../domain/season';
import { Division } from '../../domain/division';

@Component({
    selector: 'csbc-division-detail',
    templateUrl: './divisionDetail.component.html',
    styleUrls: ['../admin.component.scss']
})

export class DivisionDetailComponent implements OnInit {
    @Input() division: Division;
    seasonForm: FormGroup;

    constructor(private fb: FormBuilder) { }
    ngOnInit(): void {
        this.seasonForm = this.fb.group({
            // id: this.season.id,
            name: this.division.div_Desc,
            maxDate: this.division.maxDate,
            minDate: this.division.minDate,
            seasonId: this.division.seasonID
        });
    }

    save() {
    }
}
