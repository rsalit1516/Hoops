import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Season } from '../../domain/season';
import { Division } from '../../domain/division';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { NgClass } from '@angular/common';

@Component({
    selector: 'csbc-division-detail',
    templateUrl: './divisionDetail.component.html',
    styleUrls: ['../admin.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, NgClass, ExtendedModule]
})

export class DivisionDetailComponent implements OnInit {
    @Input() division!: Division;
    seasonForm: UntypedFormGroup;
    divisionForm: UntypedFormGroup;

    constructor(private fb: UntypedFormBuilder) {
        this.seasonForm = this.fb.group({
            // id: this.season.id,
            name: this.division.divisionDescription,
            maxDate: this.division.maxDate,
            minDate: this.division.minDate,
            seasonId: this.division.seasonId
        });
        this.divisionForm = this.fb.group({
            name: this.division.divisionDescription,
            maxDate: this.division.maxDate,
            minDate: this.division.minDate,
            seasonId: this.division.seasonId

        });
     }
    ngOnInit(): void {
        this.seasonForm = this.fb.group({
            // id: this.season.id,
            name: this.division.divisionDescription,
            maxDate: this.division.maxDate,
            minDate: this.division.minDate,
            seasonId: this.division.seasonId
        });
    }

    save() {
    }
}
