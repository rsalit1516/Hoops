import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Content } from '../../domain/content';

@Component({
    selector: 'csbc-content-edit',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss']
})

export class ContentComponent implements OnInit {
    content!: Content;

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
    }

    update(): void {}

    save() {

    }
}
